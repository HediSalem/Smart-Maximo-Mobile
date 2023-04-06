import React from 'react';

import NavigationTab from './src/routes/NavigationTab';
import {NavigationContainer} from '@react-navigation/native';

function App() {
  return (
    <NavigationContainer>
      <NavigationTab />
    </NavigationContainer>
  );
}

export default App;
