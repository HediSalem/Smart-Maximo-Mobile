import React, {useState} from 'react';
import {View} from 'react-native';
import NavigationTab from './src/routes/NavigationTab';
import LoginScreen from './src/Views/screens/LoginScreen';

function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false);

  const updateState = NewState => {
    setisLoggedIn(NewState);
  };
  return (
    <View style={{flex: 1}}>
      {!isLoggedIn ? (
        <LoginScreen LoginStatus={updateState} />
      ) : (
        <NavigationTab />
      )}
    </View>
  );
}

export default App;
