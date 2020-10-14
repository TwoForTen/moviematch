import React, { useEffect, useContext, useState } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import MovieList from '../screens/MovieList';
import MovieInfo from '../screens/Home/MovieInfo';
import { ListType } from './ProfileNavigation';
import { UserContext } from '../context/UserProvider';
import { SocketContext } from '../context/SocketProvider';

export type WatchlistStackParamList = {
  Watchlist: { movies: ListType };
  MovieInfo: { movie: any };
};

const Stack = createStackNavigator<WatchlistStackParamList>();

const HomeNavigation = () => {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const navigation = useNavigation();
  const [focused, setFocused] = useState<boolean>(true);

  useEffect(() => {
    navigation.addListener('focus', () => setFocused(true));
    navigation.addListener('blur', () => setFocused(false));
    if (user.matchedWith && user.matchedWith.notifications > 0) {
      socket.emit('clearNotifications', user._id);
    }

    return () => {
      navigation.removeListener('focus', () => setFocused(true));
      navigation.removeListener('blur', () => setFocused(false));
    };
  }, [focused]);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Watchlist"
        component={MovieList}
        options={{
          headerTitle: 'Watchlist',
        }}
        initialParams={{ movies: 'matchedMovies' }}
      />
      <Stack.Screen
        name="MovieInfo"
        component={MovieInfo}
        options={{
          header: () => null,
          cardStyleInterpolator:
            CardStyleInterpolators.forScaleFromCenterAndroid,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigation;
