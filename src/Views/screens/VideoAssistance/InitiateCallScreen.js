import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import Video from './Video';
import Colors from '../../../Styles/Colors';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';
import {Button} from '@react-native-material/core';
import {
  collectIceCandidates,
  streamCleanUp,
  getData,
  firestoreCleanUp,
  switchAudio,
  switchCamera,
  fetchDocumentNames,
  setupWebrtc,
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

  const [gettingCall, setGettingCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const pc = useRef();
  const [peerKey, setPeerKey] = useState();
  const [myKey, setMyKey] = useState('');
  const [initiateCall, setInitiateCall] = useState(false);
  const connecting = useRef(false);
  useEffect(() => {
    getData().then(value => {
      if (value !== null) {
        setMyKey(value);
        fetchDocumentNames(value, setDocumentNames);
      }
    });

    const cRef = firestore().collection('meet').doc(peerKey);
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
      console.log('event.stream', event.streams);
      //console.log('onaddstream', pc.current);
      setRemoteStream(event.streams[0]);
      console.log('event.streams[0]', event.streams[0], myKey);
      if (remoteStream) {
        console.log('ggggggggg', remoteStream.toURL());
      }
    };
  };

  const handleButtonClick = async name => {
    setPeerKey(name);
    create(name);
  };

  const create = async peerKey => {
    connecting.current = true;

    // setup webrtc

    await setupWebrtc();
    setInitiateCall(true);
    // Document for the call
    const cRef = firestore().collection('meet').doc(peerKey);
    // Handle the case when peerKey is not available

    // Exchange the ICE candidates between the caller and callee
    collectIceCandidates({pc, cRef}, myKey);
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
      };
      cRef.set(cWithOffer);

      console.log('cRef setted ');
    }
  };

  const hangup = async () => {
    console.log('clicked');
    setGettingCall(false);
    connecting.current = false;
    streamCleanUp({localStream, setLocalStream, setRemoteStream});
    firestoreCleanUp(peerKey, myKey);
    if (pc.current) {
      pc.current.close();
    }
  };

  //Displays local stream on calling
  //Displays both local and remote stream once call is connected
  if (localStream) {
    console.log('hhhhhhhh', remoteStream);
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
