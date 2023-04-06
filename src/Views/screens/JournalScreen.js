import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useSurfaceScale} from '@react-native-material/core';
import {useRoute} from '@react-navigation/native';
import Colors from '../../Styles/Colors';
import MessageBoxInput from '../components/MessageBoxInput';
function JournalScreen() {
  const scale = useSurfaceScale();
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const {Journal} = route.params;
  console.log(Journal);

  return (
    <View style={{flex: 1}}>
      <ScrollView style={{backgroundColor: scale(0).hex(), flex: 1}}>
        <Text style={styles.title}>Journal</Text>
        <View style={styles.chatRight}>
          <Text style={{fontSize: 16, color: '#fff'}}>Hello !!!</Text>
        </View>
        {Journal.map((entry, index) => (
          <View key={index} style={styles.chatLeft}>
            <Text style={{fontSize: 16, color: '#fff'}}>
              {entry.description}
            </Text>
          </View>
        ))}
      </ScrollView>
      <MessageBoxInput />
    </View>
    // <View
    //   style={[
    //     styles.card,
    //     {backgroundColor: scale(0).hex()},
    //     styles.container,
    //   ]}>
    //   <View style={styles.column}>
    //     <Text style={styles.chatLeft}> {Journal[0].description} </Text>
    //   </View>
    // </View>
  );
}

styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.navyBlue,
  },
  chatRight: {
    backgroundColor: '#0078fe',
    padding: 10,
    marginLeft: '45%',
    borderRadius: 5,
    //marginBottom: 15,
    marginTop: 5,
    marginRight: '5%',
    maxWidth: '50%',
    alignSelf: 'flex-end',
    //maxWidth: 500,

    borderRadius: 20,
  },
  chatLeft: {
    backgroundColor: Colors.navyBlue,
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: '5%',
    maxWidth: '50%',
    alignSelf: 'flex-start',
    borderRadius: 20,
  },
  container: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,

    alignItems: 'flex-start',
    textAlign: 'justify',
  },
  text: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'monospace',
    color: Colors.black,
    marginBottom: 7,
    marginTop: 7,
    textAlign: 'left',
  },
  card: {
    borderRadius: 5,
    marginBottom: 15,
    marginRight: 10,
    marginLeft: 10,
    marginTop: 10,
    padding: 20,
    flex: 1,
    alignItems: 'flex-start',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default JournalScreen;
