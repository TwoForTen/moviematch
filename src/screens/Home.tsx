import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, useWindowDimensions } from 'react-native';
import axios from '../../axiosInstance';

import useFetchData from '../hooks/useFetchData';
import InfoModal from '../components/Home/InfoModal';

const imageUrl: string = 'https://image.tmdb.org/t/p/w500';

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
        style={[styles.image, { height }]}
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
