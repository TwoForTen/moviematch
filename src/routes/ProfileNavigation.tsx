import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import Profile from '../screens/Profile/Profile';
import SearchUsers from '../screens/Profile/SearchUsers';
import PairRequests from '../screens/Profile/PairRequests';
import PairMovies from '../screens/Profile/PairMovies';
import MovieList from '../screens/MovieList';
import MovieInfo from '../screens/Home/MovieInfo';

export type ListType = 'watchedMovies' | 'ignoredMovies' | 'matchedMovies';

export type ProfileStackParamList = {
  Profile: undefined;
  MovieList: { movies: ListType; title: string };
  SearchUsers: undefined;
  PairRequests: undefined;
  PairMovies: { title: string };
  MovieInfo: { movie: any };
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
        options={{ title: 'Search Users' }}
      />
      <Stack.Screen
        name="PairRequests"
        component={PairRequests}
        options={{ title: 'Pair Requests' }}
      />
      <Stack.Screen
        name="PairMovies"
        component={PairMovies}
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="MovieInfo"
        component={MovieInfo}
        options={{
          header: () => null,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;
