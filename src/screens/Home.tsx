import React from 'react';
import { StyleSheet, Image, useWindowDimensions } from 'react-native';

import useFetchData from '../hooks/useFetchData';
import InfoModal from '../components/Home/InfoModal';

const imageUrl: string = 'https://image.tmdb.org/t/p/original';

const Home = () => {
  const { height } = useWindowDimensions();
  const { loading, response, error } = useFetchData({
    url: '/trending/movie/week',
    method: 'get',
  });

  if (loading) return null;

  return (
    <>
      <Image
        style={[styles.image, { height: height / 1.3 }]}
        source={{
          uri: `${imageUrl}${response.results[0].poster_path}`,
        }}
      />
      <InfoModal data={!loading && response.results[0]} />
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    resizeMode: 'cover',
  },
});

export default Home;
