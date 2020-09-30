import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import HomeNavigation from './HomeNavigation';
import WatchlistNavigation from './WatchlistNavigation';
import ProfileNavigation from './ProfileNavigation';
import theme from '../theme';
import { UserContext } from '../context/UserProvider';

export type BottomStackParamList = {
  Home: undefined;
  Watchlist: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomStackParamList>();

const BottomNavigation = () => {
  const {
    user: { matchedWith },
  } = useContext(UserContext);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: theme.primary,
        showLabel: false,
        inactiveTintColor: theme.secondary,
      }}
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
            <View>
              <AntDesign name="bars" size={size} color={color} />
              {matchedWith && matchedWith.notifications > 0 && (
                <View
                  style={styles.notification}
                  children={
                    <Text adjustsFontSizeToFit style={styles.number}>
                      {matchedWith.notifications}
                    </Text>
                  }
                />
              )}
            </View>
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

const styles = StyleSheet.create({
  notification: {
    height: 20,
    width: 20,
    backgroundColor: theme.danger,
    position: 'absolute',
    borderRadius: 150,
    margin: -9,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    color: theme.white,
    fontSize: 10,
  },
});

export default BottomNavigation;
