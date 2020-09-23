import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';

import theme from '../theme';
import MovieList from '../screens/MovieList';
import { ListType } from './ProfileNavigation';

export type WatchlistStackParamList = {
  Watchlist: { movies: ListType };
};

const Stack = createStackNavigator<WatchlistStackParamList>();

const PickGenre: React.FC = () => {
  return (
    <TouchableOpacity style={{ padding: 20 }}>
      <AntDesign name="setting" size={24} color={theme.black} />
    </TouchableOpacity>
  );
};

const HomeNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Watchlist"
        component={MovieList}
        options={{
          headerTitle: 'Watchlist',
          headerRight: () => <PickGenre />,
        }}
        initialParams={{ movies: 'matchedMovies' }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
