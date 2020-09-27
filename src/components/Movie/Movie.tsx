import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import ReviewStars from '../ReviewStars';
import { AntDesign } from '@expo/vector-icons';

import useFetchData from '../../hooks/useFetchData';
import theme from '../../theme';
import Actions from './Actions';

interface Props {
  id: string;
  match: string;
}

const imageUrl: string = 'https://image.tmdb.org/t/p/w500';

const Movie: React.FC<Props> = ({ id, match }) => {
  const { response, loading } = useFetchData({ url: `/movie/${id}` });

  if (loading)
    return (
      <View style={styles.container}>
        <View style={styles.imagePh} />
        <View style={styles.infoContainer}>
          <View>
            <View style={styles.titlePh} />
            <View style={styles.subTextPh} />
          </View>
        </View>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={{ borderRadius: 10, overflow: 'hidden' }}>
        <ImageBackground
          style={styles.image}
          source={{ uri: imageUrl + response?.poster_path }}
        >
          {!!match && (
            <View
              style={{
                backgroundColor: theme.background,
                alignSelf: 'flex-start',
                margin: -5.5,
                padding: 6,
                borderRadius: 100,
              }}
            >
              <AntDesign name="heart" size={17} color={theme.danger} />
            </View>
          )}
        </ImageBackground>
      </View>
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.title}>{response?.title}</Text>
          <ReviewStars rating={response?.vote_average} />
          <Text style={styles.genres}>
            {response?.genres
              ?.map((genre: { name: string }) => genre.name)
              .join(', ')}
          </Text>
          {!!match && (
            <Text
              style={{ fontStyle: 'italic', fontSize: 13 }}
            >{`${match} also matched this movie`}</Text>
          )}
        </View>
        {!!id && <Actions id={id} title={response?.title} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 20,
  },
  image: {
    height: 200,
    width: 133.3,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genres: {
    color: theme.secondary,
    marginVertical: 10,
  },
  imagePh: {
    height: 200,
    width: 133.3,
    backgroundColor: theme.secondary,
    borderRadius: 10,
  },
  titlePh: {
    height: 15,
    width: 120,
    backgroundColor: theme.secondary,
    borderRadius: 10,
    opacity: 0.5,
  },
  subTextPh: {
    height: 15,
    width: 60,
    backgroundColor: theme.secondary,
    marginTop: 10,
    borderRadius: 10,
    opacity: 0.5,
  },
});

export default Movie;
