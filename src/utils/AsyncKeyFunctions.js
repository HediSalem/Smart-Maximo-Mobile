import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const setWithExpiry = async (key, value, expiryInMinutes) => {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + expiryInMinutes * 60 * 1000,
  };
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

const removeKey = async key => {
  await AsyncStorage.removeItem(key);
};

const checkExpiryOnAppExit = async key => {
  const appState = await AppState.currentState;
  if (appState !== 'active') {
    await removeKey(key);
  }
};

const handleAppStateChange = async (nextAppState, key) => {
  if (nextAppState === 'active') {
    await checkExpiryOnAppExit(key);
  }
};

const setExpiringKey = async (key, value, expiryInMinutes) => {
  await setWithExpiry(key, value, expiryInMinutes);
  AppState.addEventListener('change', nextAppState =>
    handleAppStateChange(nextAppState, key),
  );
};

export {setExpiringKey};
