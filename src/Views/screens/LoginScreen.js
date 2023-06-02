import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from '@react-native-material/core';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';
import Colors from '../../Styles/Colors';
import {login} from '../../api/DataApis';
import {useNavigation} from '@react-navigation/native';
import {setExpiringKey} from '../../utils/AsyncKeyFunctions';
const LoginScreen = () => {
  const scale = useSurfaceScale();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handlePress = async () => {
    setLoading(true);
    const response = await login(username, password);
    if (
      true
      //response.success
    ) {
      inputInFirebase();
      await storeData(username).then(
        navigation.navigate('MainTabs', {
          screen: 'WorkOrder',
        }),
      );
    } else {
      if (
        response.error &&
        response.error.response &&
        response.error.response.data &&
        response.error.response.data.Error &&
        response.error.response.data.Error.message
      ) {
        Alert.alert(
          'Network connexion error! Please Try Again',
          response.error.response.data.Error.message,
        );
        setLoading(false);
      } else {
        setLoading(false);
        Alert.alert('Login Failed! Try again');
      }
    }
    setLoading(false);
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const inputInFirebase = () => {
    if (username.trim().length) {
      console.log('d5alna bel key');
      const signalingRef = firestore().collection('users').doc(username);

      console.log('d5alna el signaling');
      signalingRef.set({}, {merge: true});

      console.log('Signaling information saved to the database!');
    }
  };
  const storeData = async value => {
    console.log('StoreData value', value);
    //setExpiringKey('myKey', value, 30);
    AsyncStorage.setItem('myKey', value);
  };
  return (
    <View style={[styles.container, {backgroundColor: scale(0).hex()}]}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="User name"
        onChangeText={newText => setUsername(newText)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={newText => setPassword(newText)}
      />
      <Button color={Colors.navyBlue} title="Login" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#3a3a3a',
  },
  input: {
    width: '80%',
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: '#f2f2f2',
    fontSize: 16,
  },
});

export default LoginScreen;
