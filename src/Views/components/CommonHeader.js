import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../../config/Colors';
const CommonHeader = ({title}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.lightGray,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.purple,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.navyBlue,
  },
});

export default CommonHeader;
