import React, {useEffect, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionic from 'react-native-vector-icons/Ionicons';
import WorkOrderDetailScreen from '../Views/screens/WorkOrder/WorkOrderDetailScreen';
import WorkOrderListScreen from '../Views/screens/WorkOrder/WorkOrderListScreen';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../Views/screens/LoginScreen';
import AttachmentScreen from '../Views/screens/AttachmentScreen';
import TaskScreen from '../Views/screens/TaskScreen';
import JournalScreen from '../Views/screens/JournalScreen';
import {useNavigation} from '@react-navigation/native';
import InitiateCallScreen from '../Views/screens/VideoAssistance/InitiateCallScreen';
import {getData} from '../utils/VideoCallFunctions';

function NavigationTab({currentScreen, isHangedUp}) {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const navigation = useNavigation();

  useEffect(() => {
    getData().then(value => {
      if (value !== null) {
        // Key exists, navigate to MainTabs
        navigation.navigate('MainTabs');
      } else {
        // Key doesn't exist, navigate to AuthStack
        navigation.navigate('AuthStack');
      }
    });
    if (isHangedUp) {
    }
  }, []);

  const AttachmentStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Attachment"
        component={AttachmentScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
  const JournalStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Journal"
        component={JournalScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
  const TaskStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Task"
        component={TaskScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );

  const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
  const MainTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, size, colour}) => {
            let iconName;
            if (route.name === 'Work Order') {
              iconName = focused ? 'ios-home' : 'ios-home-outline';
            } else if (route.name === 'Details') {
              iconName = focused ? 'ios-list-sharp' : 'ios-list-outline';
            } else if (route.name === 'Call') {
              iconName = focused ? 'ios-videocam' : 'ios-videocam-outline';
            }
            return <Ionic name={iconName} size={size} color={colour} />;
          },
        })}>
        <Tab.Screen
          name="Work Order"
          options={{headerShown: false}}
          component={WorkOrderListScreen}
        />
        <Tab.Screen
          name="Details"
          options={{headerShown: false}}
          component={WorkOrderDetailScreen}
        />
        <Tab.Screen
          name="Call"
          options={{headerShown: false}}
          component={InitiateCallScreen}
        />
      </Tab.Navigator>
    );
  };

  return (
    <Stack.Navigator options={{headerShown: false}}>
      <Stack.Screen
        name="AuthStack"
        component={AuthStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AttachmentStack"
        component={AttachmentStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TaskStack"
        component={TaskStack}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JournalStack"
        component={JournalStack}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default NavigationTab;
