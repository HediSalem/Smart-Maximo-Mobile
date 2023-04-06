import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSurfaceScale} from '@react-native-material/core';
import {useRoute} from '@react-navigation/native';
import Colors from '../../Styles/Colors';
function TaskScreen() {
  const scale = useSurfaceScale();
  const route = useRoute();
  const {Woactivity} = route.params;

  if (!Woactivity) {
    return (
      <View style={[styles.card, {backgroundColor: scale(0).hex()}]}>
        <Text
          style={{
            fontSize: 25,
            color: Colors.navyBlue,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}>
          No tasks available
        </Text>
      </View>
    );
  }
  return (
    <View style={[styles.card, {backgroundColor: scale(0).hex()}]}>
      <Text
        style={{
          fontSize: 25,
          color: Colors.navyBlue,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}>
        Tasks
      </Text>
      {Woactivity.map(woactivity => (
        <View key={woactivity.workorderid}>
          <Text style={styles.text}>Task ID : {woactivity.taskid}</Text>
          <Text style={styles.text}>Status : {woactivity.status}</Text>
          <Text style={styles.text}>
            Description : {woactivity.description}
          </Text>
        </View>
      ))}
    </View>
  );
}
styles = StyleSheet.create({
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
  text: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'monospace',
    color: Colors.black,
    marginBottom: 7,
    marginTop: 7,
    textAlign: 'left',
  },
});
export default TaskScreen;
