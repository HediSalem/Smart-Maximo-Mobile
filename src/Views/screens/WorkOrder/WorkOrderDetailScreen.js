import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Card from '../../components/Card';
import {useRoute} from '@react-navigation/native';
function WorkOrderDetailScreen() {
  const route = useRoute();
  const {data} = route.params || {};

  if (!data) {
    return (
      <View style={styles.container}>
        <Text style={styles.field}>
          Please select an element in the home screen!!
        </Text>
      </View>
    );
  }
  return <Card cardData={data} />;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  column: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  field: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WorkOrderDetailScreen;
