import {NavigationContainer} from '@react-navigation/native';
import NavigationTab from './src/routes/NavigationTab';
import React, {useState, useRef, useEffect} from 'react';
import GettingCall from './src/Views/screens/VideoAssistance/GettingCall';
import Video from './src/Views/screens/VideoAssistance/Video';
import firestore from '@react-native-firebase/firestore';
import {
  getData,
  collectIceCandidates,
  streamCleanUp,
  switchAudio,
  switchCamera,
  firestoreCleanUp,
  setupWebrtc,
} from './src/utils/VideoCallFunctions';
import {RTCSessionDescription} from 'react-native-webrtc';
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
  const [myKey, setMyKey] = useState('');
  const connecting = useRef(false);
  const [randomValue, setRandomValue] = useState('');

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const random = Math.random();
  //     setRandomValue(random);
  //   }, 9000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);
  useEffect(() => {
    getData().then(value => {
      if (value !== null) {
        console.log('value', value);
        setMyKey(value);
      }
    });
    console.log('myKey use', myKey);
    const cRef = firestore().collection('meet').doc(myKey);
    const subscribe = cRef.onSnapshot(snapshot => {
      try {
        const data = snapshot.data();
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

    const subscribeDelete = myKey
      ? cRef.collection(myKey)?.onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            if (change.type === 'removed') {
              console.log('hangup normally', change.type);
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
  });

  const join = async () => {
    connecting.current = true;
    const cRef = firestore().collection('meet').doc(myKey);
    const offer = (await cRef.get()).data().offer;
    await setupWebrtc({
      pc,
      configuration,
      setLocalStream,
      setRemoteStream,
    });
    if (offer) {
      setGettingCall(false);
      collectIceCandidates({pc, cRef}, myKey);

      if (pc.current) {
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
    firestoreCleanUp(myKey, peerKey);
    if (pc.current) {
      pc.current.close();
    }
  };

  if (gettingCall) {
    return <GettingCall hangup={hangup} join={join} />;
  }

  if (localStream) {
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
  }

  return (
    <NavigationContainer>
      {/* //<MemoizedNavigationTab /> */}
      <NavigationTab />
    </NavigationContainer>
  );
};
//const MemoizedNavigationTab = React.memo(NavigationTab);
export default App;
