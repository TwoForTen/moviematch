import React, { useEffect, useContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import MovieList from '../screens/MovieList';
import { ListType } from './ProfileNavigation';
import { UserContext } from '../context/UserProvider';
import { SocketContext } from '../context/SocketProvider';

export type WatchlistStackParamList = {
  Watchlist: { movies: ListType };
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
    </Stack.Navigator>
  );
};

export default HomeNavigation;
