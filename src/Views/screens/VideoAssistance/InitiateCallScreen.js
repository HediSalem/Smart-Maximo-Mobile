import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {sendNotificationToJoin} from '../../components/FCM';
import Video from './Video';
import Colors from '../../../Styles/Colors';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';
import {Button} from '@react-native-material/core';
import {
  //collectIceCandidates,
  streamCleanUp,
  getData,
  firestoreCleanUp,
  switchAudio,
  switchCamera,
  fetchDocumentNames,
  getStream,
} from '../../../utils/VideoCallFunctions';
import firestore from '@react-native-firebase/firestore';
import {
  RTCSessionDescription,
  RTCIceCandidate,
  RTCPeerConnection,
} from 'react-native-webrtc';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser, faPhone} from '@fortawesome/free-solid-svg-icons/index';
import {err} from 'react-native-svg/lib/typescript/xml';

const getRandomColor = () => {
  const colorNames = Object.keys(Colors);
  const randomColorName =
    colorNames[Math.floor(Math.random() * colorNames.length)];
  return Colors[randomColorName];
};
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
export default function InitiateCallScreen() {
  const scale = useSurfaceScale();
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [documentNames, setDocumentNames] = useState([]);
  const [start, setStart] = useState(false);
  const [gettingCall, setGettingCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const pc = useRef();
  const peerKeyRef = useRef();
  const myKeyRef = useRef();
  const connecting = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      await getData().then(value => {
        if (value !== null) {
          myKeyRef.current = value;
          fetchDocumentNames(value, setDocumentNames);
        }
      });
    };
    fetchData();
    const cRef = firestore().collection('meet').doc(peerKeyRef.current);

    console.log('peeeeeer', peerKeyRef.current);
    const subscribe = cRef.onSnapshot(snapshot => {
      try {
        const data = snapshot.data();
        // If there is offer for chatId set the getting call flag
        if (
          pc.current &&
          !pc.current.remoteDescription &&
          data &&
          data.answer
        ) {
          console.log('answer aaaaa', data.answer);
          pc.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
        }
        //if one of the users hangs up without entering the call, the calls is terminated
        if (!data) {
          hangup();
        }
      } catch (error) {
        console.log('Error processing snapshot data:', error);
        // Handle the error here, e.g., show an error message to the user
      }
    });

    // On delete of collection call hangup

    // The other side has clicked on hangup
    const subscribeDelete = peerKeyRef.current
      ? cRef.collection(peerKeyRef.current)?.onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'removed') {
              console.log('hangup normalement', change.type);
              hangup();
            }
          });
        })
      : null;

    return () => {
      subscribe();
      if (subscribeDelete) {
        subscribeDelete();
      }
    };
  }, [start]);

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
  const switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  const switchAudio = () => {
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !isMuted;
    });
    setIsMuted(!isMuted);
  };
  const handleButtonClick = async name => {
    try {
      peerKeyRef.current = name; // Set the state synchronously

      await create(name); // Perform the asynchronous operation
    } catch (error) {
      // Handle any errors that occur during the state setting or the asynchronous operation
      console.error('Error: in handle', error);
      // Optionally, you can show an error message or take appropriate action
    }
  };

  const create = async peerKey => {
    connecting.current = true;

    // setup webrtc

    await setupWebrtc();
    // Document for the call
    const cRef = firestore().collection('meet').doc(peerKey);
    // Handle the case when peerKey is not available

    // Exchange the ICE candidates between the caller and callee
    collectIceCandidates(cRef, myKeyRef.current, peerKey);
    console.log('pc current gbal offer', pc.current);

    if (pc.current) {
      // Create the offer for the call
      // Store the offer under the document
      const offer = await pc.current.createOffer();
      console.log('offer in create', offer);

      pc.current.setLocalDescription(offer);
      console.log('setLocalDescription in create', pc.current);

      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
        caller: myKeyRef.current,
      };
      cRef.set(cWithOffer);

      console.log('cRef setted ');
    }
    try {
      const tRef = firestore().collection('users').doc(peerKeyRef.current);
      const snapshot = await tRef.get();
      const data = snapshot.data();
      const token = data.token;
      console.log('ttttttt', token);
      sendNotificationToJoin(token, myKeyRef.current);
    } catch (error) {
      console.error('errrrrrrrrrrrrr', error);
    }

    setStart(true);
  };

  const hangup = async () => {
    console.log('clicked');
    setGettingCall(false);
    connecting.current = false;
    streamCleanUp({localStream, setLocalStream, setRemoteStream});
    firestoreCleanUp(peerKeyRef.current, myKeyRef.current);
    if (pc.current) {
      pc.current.close();
    }
  };

  //Displays local stream on calling
  //Displays both local and remote stream once call is connected
  if (localStream) {
    return (
      <Video
        isMuted={isMuted}
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
    <ScrollView style={[styles.container, {backgroundColor: scale(0).hex()}]}>
      <View>
        <Text style={styles.tableHeader}>Connected users</Text>
        <View style={styles.rowContainer}>
          {documentNames.map(name => (
            <View key={name} style={styles.card}>
              <View style={styles.cardContent}>
                <FontAwesomeIcon
                  icon={faUser}
                  style={[styles.cardIcon, {color: getRandomColor()}]}
                  size={120}
                />
                <Text style={styles.cardText}>{name}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.stretchedButton}>
                  <Button
                    title="Call"
                    color={Colors.green}
                    onPress={() => handleButtonClick(name)}
                    leading={
                      <FontAwesomeIcon
                        icon={faPhone}
                        style={{color: Colors.mystic}}
                      />
                    }
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'flex-start',
    //justifyContent: 'flex-start',
  },
  buttonContainer: {
    flex: 1,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  stretchedButton: {
    width: '100%',
  },
  buttonTitle: {
    flex: 1,
    textAlign: 'center',
    // Add other button title styles as needed
  },
  tableHeader: {
    //flex: 1,
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 25,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    borderRadius: 5,
    marginBottom: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: Colors.royalBlue,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    color: getRandomColor(),
    alignSelf: 'center',
  },
  cardText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: -5,
  },
});
