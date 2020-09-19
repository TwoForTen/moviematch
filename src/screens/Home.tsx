import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Image, View, Text, ActivityIndicator } from 'react-native';
import { debounce, isEmpty } from 'lodash';
import {
  Directions,
  FlingGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
// import { Entypo } from '@expo/vector-icons';

import useFetchData from '../hooks/useFetchData';
import InfoModal from '../components/Home/InfoModal';
import theme from '../theme';

const imageUrl: string = 'https://image.tmdb.org/t/p/original';

const Home = () => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [movie, setMovie] = useState<number>(0);
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const { loading, response, error } = useFetchData({
    url: `/trending/movie/week?page=${page}`,
  });

  const handleSwipe = useCallback(
    debounce(() => {
      {
        if (movie >= movies.length - 3)
          setPage((prev) => (prev < response.total_pages ? prev + 1 : prev));
        setMovie((prev) => (prev < movies.length - 1 ? prev + 1 : prev));
      }
    }, 200),
    [movie, response.results]
  );

  useEffect(() => {
    setMovies((prev) => [...prev, ...response.results]);
  }, [response.results]);

  if (loading || isEmpty(response.results))
    return (
      <View
        style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator size={40} />
      </View>
    );

  return (
    <PanGestureHandler activeOffsetX={[-25, 25]} onGestureEvent={handleSwipe}>
      <FlingGestureHandler direction={Directions.RIGHT | Directions.LEFT}>
        <PanGestureHandler
          activeOffsetY={-100}
          onGestureEvent={({ nativeEvent }) =>
            nativeEvent.velocityY < 0 && setShowModal(true)
          }
        >
          <View style={styles.background}>
            <Image
              style={styles.image}
              source={{
                uri: `${imageUrl}${movies[movie].poster_path}`,
              }}
            />

            {/* <View style={styles.infoSwipe}>
              <Entypo
                name="info-with-circle"
                size={24}
                color={theme.secondary}
              />
              <Text style={styles.infoText}>Swipe up for info</Text>
            </View> */}

            <InfoModal
              showModal={showModal}
              setShowModal={setShowModal}
              data={movies[movie]}
            />
          </View>
        </PanGestureHandler>
      </FlingGestureHandler>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    resizeMode: 'cover',
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
  },
  infoSwipe: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  infoText: {
    color: theme.secondary,
    fontSize: 16,
  },
});

export default Home;
