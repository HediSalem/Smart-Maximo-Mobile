import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {Button} from '@react-native-material/core';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';
import Colors from '../../Styles/Colors';
import {login, getWoDetail} from '../../api/DataApis';
import SQLite from 'react-native-sqlite-storage';

const LoginScreen = ({LoginStatus}) => {
  const scale = useSurfaceScale();
  const db = SQLite.openDatabase({name: 'myDatabase.db'});

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const insertDataIntoDatabase = async () => {
    try {
      const responseDetail = await getWoDetail();
      const data = responseDetail;
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS myTable (wonum TEXT PRIMARY KEY, status TEXT, siteid TEXT,wopriority INTEGER, description TEXT)',
          [],
          () => {
            console.log('database created');
            data.forEach(item => {
              console.log('inserting item:', item);
              tx.executeSql(
                'INSERT INTO myTable (wonum, status,siteid,wopriority,description) VALUES (?, ?,?,?,?)',
                [
                  item.wonum,
                  item.status,
                  item.siteid,
                  item.wopriority,
                  item.description,
                ],
                () => {
                  console.log(`Inserted ${item.wonum} into the database`);
                },
                error => {
                  console.log(`Error inserting ${item.wonum}: ${error}`);
                },
              );
            });
          },
          error => {
            console.log(`Error creating table: ${error}`);
          },
        );
      });
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  };
  const handlePress = async () => {
    const response = await login(username, password);
    if (response.success) {
      console.log('Login successful!', response.data);
      LoginStatus(true);
      insertDataIntoDatabase();
    } else {
      if (response.error.response.data.Error.message)
        Alert.alert('Login Failed', response.error.response.data.Error.message);
    }
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
