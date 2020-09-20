import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import Profile from '../screens/Profile/Profile';
import SearchUsers from '../screens/Profile/SearchUsers';
import MovieList from '../screens/MovieList';

export type ProfileStackParamList = {
  Profile: undefined;
  MovieList: { movies: string[]; title: string };
  SearchUsers: { title: string };
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
      <Stack.Screen
        name="MovieList"
        component={MovieList}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="SearchUsers"
        component={SearchUsers}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
