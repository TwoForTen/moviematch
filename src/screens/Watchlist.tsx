import React, { useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MovieList from './MovieList';
import { UserContext } from '../context/UserProvider';

const Watchlist = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.navigate('MovieList', { title: 'Hey Juuude', movies: [] });
  }, []);

  return null;
};

export default Watchlist;
