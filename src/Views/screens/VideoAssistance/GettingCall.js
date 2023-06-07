import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Colors from '../../../Styles/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPhone} from '@fortawesome/free-solid-svg-icons/index';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function GettingCall({hangup, join, peerKey}) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/incoming_call.png')}
          style={styles.icon}
        />
        <Text style={styles.caller}>{peerKey} is calling you! </Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.CallButton}>
          <TouchableOpacity onPress={join}>
            <FontAwesomeIcon
              icon={faPhone}
              style={{color: Colors.white, alignItems: 'center'}}
              rotation={270}
              size={25}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.HangUpButton}>
          <TouchableOpacity onPress={hangup}>
            <Icon
              name="phone-hangup"
              size={30}
              style={{color: Colors.white, alignItems: 'center'}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caller: {
    fontSize: 25,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  icon: {
    width: 300,
    height: 300,
  },
  CallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  HangUpButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
});

export default GettingCall;
