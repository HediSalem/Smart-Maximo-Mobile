import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NavigationContainer from '@react-navigation/native/src/NavigationContainer';
import Ionic from 'react-native-vector-icons/Ionicons';
import WorkOrderDetailScreen from '../Views/screens/WorkOrder/WorkOrderDetailScreen';
import WorkOrderListScreen from '../Views/screens/WorkOrder/WorkOrderListScreen';
function NavigationTab() {
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, size, colour}) => {
            let iconName;
            if (route.name === 'Work Order') {
              iconName = focused ? 'ios-home' : 'ios-home-outline';
            } else if (route.name === 'Details') {
              iconName = focused ? 'ios-list-sharp' : 'ios-list-outline';
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default NavigationTab;
