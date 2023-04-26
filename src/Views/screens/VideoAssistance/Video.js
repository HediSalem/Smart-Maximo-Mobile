import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RTCView} from 'react-native-webrtc';
import Colors from '../../../Styles/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faPhone,
  faCameraRotate,
  faVolumeUp,
} from '@fortawesome/free-solid-svg-icons/index';

function HangupButton({hangup}) {
  return (
    <View style={styles.btContainer}>
      <TouchableOpacity onPress={hangup}>
        <FontAwesomeIcon
          icon={faPhone}
          style={{color: Colors.white, alignItems: 'center'}}
          rotation={180}
        />
      </TouchableOpacity>
    </View>
  );
}

function CameraButton({switchCamera}) {
  return (
    <View style={styles.CameraSwitch}>
      <TouchableOpacity onPress={switchCamera}>
        <FontAwesomeIcon
          size={25}
          icon={faCameraRotate}
          style={{color: Colors.white, alignItems: 'center'}}
        />
      </TouchableOpacity>
    </View>
  );
}
function VolumeButton({switchAudio}) {
  return (
    <View style={styles.CameraSwitch}>
      <TouchableOpacity onPress={switchAudio}>
        <FontAwesomeIcon
          size={25}
          icon={faVolumeUp}
          style={{color: Colors.white, alignItems: 'center'}}
        />
      </TouchableOpacity>
    </View>
  );
}

function Video({localStream, remoteStream, hangup, switchCamera, switchAudio}) {
  // on Call we display the localStream

  if (localStream && !remoteStream) {
    return (
      <View style={styles.container}>
        <RTCView
          streamURL={localStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <HangupButton hangup={hangup} />
      </View>
    );
  }

  // Once the call is connected we display localStream on Top of remoteStream
  if (localStream && remoteStream) {
    return (
      <View style={styles.container}>
        <RTCView
          streamURL={remoteStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <RTCView
          streamURL={localStream.toURL()}
          objectFit={'cover'}
          style={styles.videoLocal}
        />
        <View style={styles.bt}>
          <HangupButton hangup={hangup} />
          <CameraButton switchCamera={switchCamera} />
          <VolumeButton switchAudio={switchAudio} />
        </View>
      </View>
    );
  }

  // If neither localStream nor remoteStream is available, render nothing
  return null;
}

const styles = StyleSheet.create({
  bt: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  videoLocal: {
    position: 'absolute',
    width: 100,
    height: 150,
    top: 0,
    left: 20,
    elevation: 10,
  },
  btContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: 30,
    marginRight: 15,
  },
  CameraSwitch: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    bottom: 30,
    marginRight: 15,
  },
});

export default Video;
