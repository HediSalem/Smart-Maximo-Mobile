import {NavigationContainer} from '@react-navigation/native';
import NavigationTab from './src/routes/NavigationTab';
import React, {useState, useRef, useEffect} from 'react';
import GettingCall from './src/Views/screens/VideoAssistance/GettingCall';
import Video from './src/Views/screens/VideoAssistance/Video';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

import {
  //getData,
  streamCleanUp,
  firestoreCleanUp,
  getStream,
} from './src/utils/VideoCallFunctions';
import {getMessage} from './src/Views/components/FCM';
import {
  RTCSessionDescription,
  RTCPeerConnection,
  RTCIceCandidate,
} from 'react-native-webrtc';
const App = () => {
  const configuration = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
      {
        urls: 'stun:stun1.l.google.com:19302',
      },
      {
        urls: 'stun:stun2.l.google.com:19302',
      },
    ],
  };

  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [gettingCall, setGettingCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const pc = useRef();
  const [peerKey, setPeerKey] = useState('');

  const myKeyRef = useRef('');
  const connecting = useRef(false);
  const [isHangedUp, setIsHangedUp] = useState(false);
  const fetchAndSetData = async () => {
    const value = await AsyncStorage.getItem('myKey');

    return value;
  };

  const connectToFireBase = value => {
    console.log('***************', value);
    const cRef = firestore().collection('meet').doc(value);
    cRef.onSnapshot(async snapshot => {
      try {
        const data = snapshot.data();

        getMessage();
        if (data && data.caller) {
          setPeerKey(data.caller);
        }
        if (data && data.offer && !connecting.current) {
          setGettingCall(true);
        }

        if (!data) {
          hangup();
        }
      } catch (error) {
        console.log('Error processing snapshot data:', error);
      }
    });
  };

  useEffect(() => {
    const fetch = async () => {
      const value = await fetchAndSetData();
      connectToFireBase(value);
      myKeyRef.current = value;
    };
    fetch();
    const cRef = firestore().collection('meet').doc(myKeyRef.current);
    const subscribeDelete = myKeyRef.current
      ? cRef.collection(myKeyRef.current)?.onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'removed') {
              console.log('hangup normally', change.type);
              hangup();
            }
          });
        })
      : null;

    return () => {
      fetch();

      if (subscribeDelete) {
        subscribeDelete();
      }
    };
  }, []);

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
  const switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  const switchAudio = () => {
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !isMuted;
    });
    setIsMuted(!isMuted);
  };
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
      console.log('event.streams[0]', event.streams[0], myKeyRef.current);
      if (remoteStream) {
        console.log('ggggggggg', remoteStream.toURL());
      }
    };
  };
  const join = async () => {
    connecting.current = true;
    console.log('myKeyRef.current in join', myKeyRef.current);
    const cRef = firestore().collection('meet').doc(myKeyRef.current);
    const offer = (await cRef.get()).data().offer;
    const caller = (await cRef.get()).data().caller;

    await setupWebrtc();
    if (offer) {
      setGettingCall(false);
      collectIceCandidates(cRef, myKeyRef.current, caller);

      if (pc.current) {
        console.log('setRemoteDescriptionsetRemoteDescription');
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));

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

  const hangup = async () => {
    setGettingCall(false);
    connecting.current = false;
    streamCleanUp({localStream, setLocalStream, setRemoteStream});
    firestoreCleanUp(myKeyRef.current, peerKey);
    if (pc.current) {
      pc.current.close();
    }
    setIsHangedUp(true);
  };

  if (gettingCall) {
    return <GettingCall hangup={hangup} join={join} peerKey={peerKey} />;
  } else if (localStream) {
    return (
      <NavigationContainer>
        <Video
          isMuted={isMuted}
          switchAudio={switchAudio}
          switchCamera={switchCamera}
          hangup={hangup}
          localStream={localStream}
          remoteStream={remoteStream}
        />
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <NavigationTab isHangedUp={isHangedUp} />
      </NavigationContainer>
    );
  }
};
export default App;
