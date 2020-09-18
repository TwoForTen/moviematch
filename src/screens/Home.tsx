import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, useWindowDimensions } from 'react-native';
import axios from '../../axiosInstance';

import InfoModal from '../components/Home/InfoModal';

const imageUrl: string = 'https://image.tmdb.org/t/p/w500';

const Home = () => {
  const [results, setResults] = useState<any[]>([]);
  const { height } = useWindowDimensions();
  useEffect(() => {
    axios
      .get('/trending/movie/week')
      .then(({ data }) => setResults(data.results));
  }, []);

  return (
    <>
      {results[0] && (
        <Image
          style={[styles.image, { height }]}
          source={{
            uri: `${imageUrl}${results[0].poster_path}`,
          }}
        />
      )}
      <InfoModal data={results[0]} />
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
