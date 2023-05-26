import React, {useState, useRef, useEffect} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
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
} from '../../../utils/VideoCallFunctions';
import firestore from '@react-native-firebase/firestore';
import {
  RTCSessionDescription,
  RTCIceCandidate,
  RTCPeerConnection,
} from 'react-native-webrtc';
export default function InitiateCallScreen() {
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
  const scale = useSurfaceScale();
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [documentNames, setDocumentNames] = useState([]);
  const [showAcceptCall, setShowAcceptCall] = useState(false);

  const [gettingCall, setGettingCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const pc = useRef();
  const [peerKey, setPeerKey] = useState(undefined);
  const [myKey, setMyKey] = useState('');
  const [initiateCall, setInitiateCall] = useState(false);
  const connecting = useRef(false);

  useEffect(() => {
    getData().then(value => {
      if (value !== null) {
        setMyKey(value);
      }
    });
    fetchDocumentNames({myKey, setDocumentNames});

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

  useEffect(() => {}, [peerKey]);

  const handleButtonClick = async name => {
    setPeerKey(name);
    create(peerKey);
  };

  const create = async peerKey => {
    if (peerKey) {
      connecting.current = true;
      setInitiateCall(true);
      // setup webrtc

      await setupWebrtc({
        pc,
        configuration,
        setLocalStream,
        setRemoteStream,
      });

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
        setShowAcceptCall(true);
      }
    } else {
      Alert.alert('Try again');
      return;
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
    <View style={[styles.container, {backgroundColor: scale(0).hex()}]}>
      <View>
        {documentNames.map(name => (
          <View key={name} style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{marginRight: 8}}>{name}</Text>
            <Button
              title="Call"
              color={Colors.navyBlue}
              onPress={() => handleButtonClick(name)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
