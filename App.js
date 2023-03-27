import React, {useState} from 'react';
import {View} from 'react-native';
import NavigationTab from './src/routes/NavigationTab';

function App() {
  return (
    <View style={{flex: 1}}>
      <NavigationTab />
    </View>
  );
}

export default App;
