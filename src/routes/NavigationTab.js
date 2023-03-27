import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NavigationContainer from '@react-navigation/native/src/NavigationContainer';
import Ionic from 'react-native-vector-icons/Ionicons';
import WorkOrderDetailScreen from '../Views/screens/WorkOrder/WorkOrderDetailScreen';
import WorkOrderListScreen from '../Views/screens/WorkOrder/WorkOrderListScreen';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../Views/screens/LoginScreen';
function NavigationTab() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
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
            if (route.name === 'WorkOrder') {
              iconName = focused ? 'ios-home' : 'ios-home-outline';
            } else if (route.name === 'Details') {
              iconName = focused ? 'ios-list-sharp' : 'ios-list-outline';
            }
            return <Ionic name={iconName} size={size} color={colour} />;
          },
        })}>
        <Tab.Screen
          name="WorkOrder"
          options={{headerShown: false}}
          component={WorkOrderListScreen}
        />
        <Tab.Screen
          name="Details"
          options={{headerShown: false}}
          component={WorkOrderDetailScreen}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationTab;
