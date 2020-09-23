import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import HomeNavigation from './HomeNavigation';
import WatchlistNavigation from './WatchlistNavigation';
import ProfileNavigation from './ProfileNavigation';
import theme from '../theme';

export type BottomStackParamList = {
  Home: undefined;
  Watchlist: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomStackParamList>();

const BottomNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: theme.primary, showLabel: false }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigation}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistNavigation}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="bars" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigation}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
