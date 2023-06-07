import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../Styles/Colors';
import {useSurfaceScale} from '@react-native-material/core/src/hooks/use-surface-scale';

const CommonHeader = ({title}) => {
  const scale = useSurfaceScale();
  return (
    <View style={[styles.header, {backgroundColor: scale(0).hex()}]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.navyBlue,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.navyBlue,
  },
});

export default CommonHeader;
