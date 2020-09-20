import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import Profile from '../screens/Profile/Profile';
import MovieList from '../screens/MovieList';

export type ProfileStackParamList = {
  Profile: undefined;
  MovieList: { movies: string[] };
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ header: () => null }}
      />
      <Stack.Screen name="MovieList" component={MovieList} />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
