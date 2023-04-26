import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Colors from '../../../Styles/Colors';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPhone} from '@fortawesome/free-solid-svg-icons/index';

function GettingCall({hangup, join}) {
  return (
    <View style={styles.container}>
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
          <FontAwesomeIcon
            icon={faPhone}
            style={{color: Colors.white, alignItems: 'center'}}
            rotation={90}
            size={25}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  CallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    alignSelf: 'flex-end',
  },
  HangUpButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    alignSelf: 'flex-end',
  },
});

export default GettingCall;
