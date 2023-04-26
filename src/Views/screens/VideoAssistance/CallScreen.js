import React, {useState, useRef, useEffect} from 'react';
import {Text, StyleSheet, Button, View} from 'react-native';
import GettingCall from './GettingCall';
import Video from './Video';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {getStream} from '../../../utils/VideoCallFunctions';
import {faVideo} from '@fortawesome/free-solid-svg-icons/index';
import firestore from '@react-native-firebase/firestore';
const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};

export default function CallScreen() {
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [gettingCall, setGettingCall] = useState();
  const [facingMode, setFacingMode] = useState('user');
  const [isMuted, setIsMuted] = useState(false);

  const pc = useRef();

  const connecting = useRef(false);

  useEffect(() => {
    const cRef = firestore().collection('meet').doc('chatId');

    const subscribe = cRef.onSnapshot(snapshot => {
      const data = snapshot.data();

      // on answer start call
      if (pc.current && !pc.current.remoteDescription && data && data.answer) {
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      // If there is offer for chatId set the getting call flag
      if (data && data.offer && !connecting.current) {
        setGettingCall(true);
      }
    });
    // On delete of collection call hangup
    // The other side has clicked on hangup
    const subscribeDelete = cRef.collection('callee').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == 'removed') {
          hangup();
        }
      });
    });
    return () => {
      subscribe();
      subscribeDelete();
    };
  }, []);

  const setupWebrtc = async () => {
    //console.log(' origin current: ', pc.current);
    pc.current = new RTCPeerConnection(configuration);
    // Get the audio and video stream for the call
    const stream = await getStream();
    if (stream) {
      setLocalStream(stream);
      // pc.current.addStream(stream);
      stream.getTracks().forEach(track => {
        pc.current.addTrack(track, stream);
      });
    }

    // Get the remote stream once it is available
    pc.current.ontrack = event => {
      console.log('event.stream', event.streams);
      //console.log('onaddstream', pc.current);
      setRemoteStream(event.streams[0]);
    };
  };

  const switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
    console.log('localStream.getVideoTracks()', localStream.getVideoTracks());
  };
  const switchAudio = () => {
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !isMuted;
    });
    setIsMuted(!isMuted);
    console.log('localStream.audio()', localStream.getAudioTracks());
  };

  const create = async () => {
    console.log('calling');
    connecting.current = true;

    // setup webrtc

    await setupWebrtc();

    // Document for the call
    const cRef = firestore().collection('meet').doc('chatId');

    // Exchange the ICE candidates between the caller and callee
    collectIceCandidates(cRef, 'caller', 'callee');
    if (pc.current) {
      // Create the offer for the call
      // Store the offer under the document
      const offer = await pc.current.createOffer();
      // console.log('offer', offer);
      pc.current.setLocalDescription(offer);
      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
      };
      cRef.set(cWithOffer);
      console.log('cRef setted ');
    }
  };
  const join = async () => {
    console.log('Joining call');
    connecting.current = true;
    setGettingCall(false);

    const cRef = firestore().collection('meet').doc('chatId');
    const offer = (await cRef.get()).data().offer;
    //console.log('offer ', offer);
    if (offer) {
      // setup webrtc
      await setupWebrtc();

      // Exchange the ICE candidate
      // check the parameters, it's reversed. since joining part is callee
      collectIceCandidates(cRef, 'callee', 'caller');
      if (pc.current) {
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));

        // Create the answer for the call
        // Update the document with answer

        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer);
        const cWithAnswer = {
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
        };
        cRef.update(cWithAnswer);
      }
    }
  };
  /**
   * For disconnecting the call close the connection, release the stream
   * And delete the document for the call
   */

  const hangup = async () => {
    setGettingCall(false);
    connecting.current = false;
    streamCleanUp();
    firestoreCleanUp();
    if (pc.current) {
      pc.current.close();
    }
  };

  // Helper function
  const streamCleanUp = async () => {
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };
  const firestoreCleanUp = async () => {
    const cRef = firestore().collection('meet').doc('chatId');

    if (cRef) {
      const calleeCandidate = await cRef.collection('callee').get();
      calleeCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });
      const callerCandidate = await cRef.collection('caller').get();
      callerCandidate.forEach(async candidate => {
        await candidate.ref.delete();
      });
      cRef.delete();
    }
  };
  const collectIceCandidates = async (cRef, localName, remoteName) => {
    console.log('collect');
    const candidteCollection = cRef.collection(localName);
    //console.log('candidteCollection', candidteCollection);
    if (pc.current) {
      // on new ICE candidate add it to firestore
      pc.current.onicecandidate = event => {
        console.log('event.candidate', event.candidate);

        if (event.candidate) {
          candidteCollection.add(event.candidate);
          console.log('candidteCollection eveny', event.candidate);
        }
      };
    }

    // Get the ICE candidate added to firestore and update the local pc
    cRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          console.log('candidattttttttt', candidate);
          pc.current.addIceCandidate(candidate);
        }
      });
    });
  };

  //Displays the gettingCall component
  if (gettingCall) {
    console.log('gettincall');
    return <GettingCall hangup={hangup} join={join} />;
  }
  //Displays local stream on calling
  //Displays both local and remote stream once call is connected
  if (localStream) {
    return (
      <Video
        switchAudio={switchAudio}
        switchCamera={switchCamera}
        hangup={hangup}
        localStream={localStream}
        remoteStream={remoteStream}
      />
    );
  }
  //Displays the Call button
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={create}>
        <FontAwesomeIcon icon={faVideo} flip="horizontal" size={30} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:
  },
  heading: {
    alignSelf: 'center',
    fontSize: 30,
  },
  rtcview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    margin: 5,
  },
  rtc: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  toggleButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  callButtons: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    margin: 5,
  },
});
