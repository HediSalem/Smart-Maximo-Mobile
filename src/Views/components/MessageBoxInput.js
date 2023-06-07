import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Colors from '../../Styles/Colors';
import Ionic from 'react-native-vector-icons/Ionicons';
const MessageBoxInput = () => {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message here"
        value={text}
        onChangeText={setText}
      />
      <Ionic name="md-send-sharp" size={20} style={styles.sendIcon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.mystic,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  sendIcon: {
    marginLeft: 10,
    color: '#007aff',
  },
});

export default MessageBoxInput;
