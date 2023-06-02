import React, {useState, useRef, useEffect} from 'react';
import {Button} from '@react-native-material/core';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Video from './src/Views/screens/VideoAssistance/Video';
import {
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  getStream,
  fetchDocumentNames,
  firestoreCleanUp,
  getData,
} from './src/utils/VideoCallFunctions';

import {faUser, faPhone} from '@fortawesome/free-solid-svg-icons/index';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';

import Colors from './src/Styles/Colors';
import {faVideo} from '@fortawesome/free-solid-svg-icons/index';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';
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
function StartCall() {
  const scale = useSurfaceScale();
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [facingMode, setFacingMode] = useState('user');
  const [isMuted, setIsMuted] = useState(false);
  const [documentNames, setDocumentNames] = useState([]);
  const [peerKey, setPeerKey] = useState();
  const [myKey, setMyKey] = useState('');
  const [initiateCall, setInitiateCall] = useState(false);

  const pc = useRef();
  const [gettingCall, setGettingCall] = useState();
  const connecting = useRef(false);
  useEffect(() => {
    getData().then(value => {
      if (value !== null) {
        setMyKey(value);
        fetchDocumentNames(value, setDocumentNames);
      }
    });
    const cRef = firestore().collection('meet').doc(peerKey);
    const deviceId = DeviceInfo.getUniqueId();
    const subscribe = cRef.onSnapshot(snapshot => {
      const data = snapshot.data();
      console.log('data subscribe', data);
      // on answer start call
      if (pc.current && !pc.current.remoteDescription && data && data.answer) {
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        console.log('answer created in firebase', data.answer);
      }

      // If there is offer for chatId set the getting call flag
    });
    // On delete of collection call hangup
    // The other side has clicked on hangup
    const subscribeDelete = peerKey
      ? cRef.collection(peerKey)?.onSnapshot(snapshot => {
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
  }, [initiateCall]);
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
      console.log('event.stream', event.streams[0]);
      //console.log('onaddstream', pc.current);
      setRemoteStream(event.streams[0]);
    };
  };
  const handleButtonClick = async name => {
    setPeerKey(name);
    create(name);
  };
  const hangup = async () => {
    setGettingCall(false);
    connecting.current = false;
    streamCleanUp();
    firestoreCleanUp(peerKey, myKey);
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

  const create = async peerKey => {
    console.log('calling');
    connecting.current = true;
    setInitiateCall(true);
    // setup webrtc

    await setupWebrtc();

    // Document for the call
    const cRef = firestore().collection('meet').doc(peerKey);

    // Exchange the ICE candidates between the caller and callee
    collectIceCandidates(cRef, myKey, peerKey);
    if (pc.current) {
      // Create the offer for the call
      // Store the offer under the document
      const offer = await pc.current.createOffer();
      // console.log('offer', offer);
      pc.current.setLocalDescription(offer);
      const deviceId = DeviceInfo.getUniqueId();
      const cWithOffer = {
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
        caller: {
          callerId: myKey,
        },
      };
      cRef.set(cWithOffer);

      console.log('cRef setted ');
    }
  };
  if (localStream) {
    return (
      <Video
        hangup={hangup}
        localStream={localStream}
        remoteStream={remoteStream}
      />
    );
  } else {
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
}

export default StartCall;
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
