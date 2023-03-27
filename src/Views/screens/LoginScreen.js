import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Button} from '@react-native-material/core';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';
import Colors from '../../Styles/Colors';
import {login, getWoDetail} from '../../api/DataApis';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const scale = useSurfaceScale();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handlePress = async () => {
    setLoading(true);
    const response = await login(username, password);
    if (response.success) {
      const responseDetail = await getWoDetail();
      navigation.navigate('MainTabs', {
        screen: 'WorkOrder',
        params: {responseDetail: responseDetail},
      });
    } else {
      if (
        response.error &&
        response.error.response &&
        response.error.response.data &&
        response.error.response.data.Error &&
        response.error.response.data.Error.message
      ) {
        setLoading(false);
        Alert.alert('Login Failed', response.error.response.data.Error.message);
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
