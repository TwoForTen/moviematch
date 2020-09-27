import React, { useContext } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../../axiosInstance';

import useDataFetch from '../../hooks/useDataFetch';
import theme from '../../theme';
import { GenreContext, Genre } from '../../context/GenreProvider';

const fetcher = () => axiosInstance.get('/genre/movie/list');

const Settings = () => {
  const { setGenre } = useContext(GenreContext);
  const { response, loading } = useDataFetch('genres', fetcher());
  const navigation = useNavigation();

  const switchGenre = (genre: Genre) => {
    setGenre(genre);
    navigation.navigate('Home');
  };

  if (loading)
    return (
      <View style={styles.centerView}>
        <ActivityIndicator size={40} color={theme.primary} />
      </View>
    );

  return (
    <ScrollView style={{ flex: 1 }}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.6}
        onPress={switchGenre.bind(this, { id: '0', name: 'Trending' })}
      >
        <Text style={styles.text}>Trending</Text>
      </TouchableOpacity>
      {response.genres.map((genre: { id: number; name: string }) => {
        return (
          <TouchableOpacity
            style={styles.button}
            key={genre.id}
            activeOpacity={0.6}
            onPress={switchGenre.bind(this, {
              id: genre.id.toString(),
              name: genre.name,
            })}
          >
            <Text style={styles.text}>{genre.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 10,
    borderBottomColor: 'rgba(0,0,100,0.07)',
    borderBottomWidth: 0.7,
  },
  text: {
    fontSize: 18,
  },
});

export default Settings;
