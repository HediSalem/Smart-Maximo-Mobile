import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSurfaceScale} from '@react-native-material/core';
import {useRoute} from '@react-navigation/native';
import Colors from '../../Styles/Colors';
function TaskScreen() {
  const scale = useSurfaceScale();
  const route = useRoute();
  const {Task} = route.params;
  return (
    <View style={[styles.card, {backgroundColor: scale(0).hex()}]}>
      <Text> Welcome!!</Text>
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
});
export default TaskScreen;
