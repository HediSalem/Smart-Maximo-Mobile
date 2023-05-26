import {mediaDevices, RTCPeerConnection} from 'react-native-webrtc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {RTCIceCandidate} from 'react-native-webrtc';
export const getStream = async () => {
  let isFront = true;
  try {
    const sourceInfos = await mediaDevices.enumerateDevices();
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (
        sourceInfo.kind === 'videoinput' &&
        sourceInfo.facing === (isFront ? 'front' : 'environment')
      ) {
        videoSourceId = sourceInfo.deviceId;
      }
    }

    const stream = await new Promise((resolve, reject) => {
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: isFront ? 'user' : 'environment',
            deviceId: videoSourceId,
          },
        })
        .then(resolve)
        .catch(reject);
    });

    return stream;
  } catch (error) {
    console.error('Error getting media stream:', error);
    return null;
  }
};
export const setupWebrtc = async ({
  pc,
  configuration,
  setLocalStream,
  setRemoteStream,
}) => {
  try {
    // Create a new PeerConnection object
    pc.current = new RTCPeerConnection(configuration);
    // Get the audio and video stream for the call
    const stream = await getStream();

    if (stream) {
      setLocalStream(stream);

      // Add tracks to the PeerConnection
      console.log('stream', stream);
      stream.getTracks().forEach(track => {
        try {
          pc.current.addTrack(track, stream);
          console.log('Track added successfully');
        } catch (error) {
          console.log('Error adding track:', error);
        }
      });

      // Get the remote stream once it is available
      pc.current.ontrack = event => {
        setRemoteStream(event.streams[0]);
      };
    }
  } catch (error) {
    console.error('Error setting up WebRTC:', error);
  }
};
export const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('myKey');
    if (value !== null) {
      console.log('myKey from storage:', value);
    }
    return value;
  } catch (e) {
    console.log('Failed to fetch the data from storage:', e);
    return null;
  }
};
export const collectIceCandidates = async ({pc, cRef}, remoteName) => {
  const candidteCollection = cRef.collection(remoteName);

  if (pc.current) {
    pc.current.onicecandidate = event => {
      if (event.candidate) {
        candidteCollection.add(event.candidate);
      }
    };
  }

  cRef.collection(remoteName).onSnapshot(async snapshot => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        const candidateData = change.doc.data();

        const candidate = new RTCIceCandidate(candidateData);

        await pc.current.addIceCandidate(candidate);
      }
    });
  });
};
export const streamCleanUp = async ({
  localStream,
  setLocalStream,
  setRemoteStream,
}) => {
  if (localStream) {
    localStream.getTracks().forEach(t => t.stop());
    localStream.release();
  }
  setLocalStream(null);
  setRemoteStream(null);
};
export const switchCamera = () => {
  localStream.getVideoTracks().forEach(track => track._switchCamera());
};

export const switchAudio = () => {
  localStream.getAudioTracks().forEach(track => {
    track.enabled = !isMuted;
  });
  setIsMuted(!isMuted);
};
export const firestoreCleanUp = async (key1, key2) => {
  const cRef2 = firestore().collection('meet').doc(key1);
  await cRef2.update({
    offer: firestore.FieldValue.delete(),
    answer: firestore.FieldValue.delete(),
  });
  const calleeCollectionRef = cRef2.collection(key2);
  if (calleeCollectionRef) {
    const calleeCandidate = await calleeCollectionRef.get();
    calleeCandidate.forEach(async candidate => {
      await candidate.ref.delete();
    });
  }

  const callerCollectionRef = cRef2.collection(key1);
  if (callerCollectionRef) {
    const callerCandidate = await callerCollectionRef.get();
    callerCandidate.forEach(async candidate => {
      await candidate.ref.delete();
    });
  }
};
export const fetchDocumentNames = async ({excludedName, setDocumentNames}) => {
  try {
    const querySnapshot = await firestore().collection('meet').get();

    const names = querySnapshot.docs
      .filter(doc => doc.id !== excludedName)
      .map(doc => doc.id);
    setDocumentNames(names);
  } catch (error) {
    console.log('Error getting documents: ', error);
  }
};
