import React, { useState, useCallback, useEffect, useContext } from 'react';
import { StyleSheet, Image, View, ActivityIndicator } from 'react-native';
import { debounce, isEmpty } from 'lodash';
import {
  GestureHandlerGestureEventNativeEvent,
  PanGestureHandler,
  PanGestureHandlerEventExtra,
} from 'react-native-gesture-handler';

import useFetchData from '../../hooks/useFetchData';
import InfoModal from '../../components/Home/InfoModal';
import theme from '../../theme';
import { UserContext } from '../../context/UserProvider';
import { SocketContext } from '../../context/SocketProvider';
import { GenreContext } from '../../context/GenreProvider';

const imageUrl: string = 'https://image.tmdb.org/t/p/original';

const Home = () => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [movie, setMovie] = useState<number>(0);
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const { genre } = useContext(GenreContext);

  const { loading, response } = useFetchData({
    url: `/discover/movie?page=${page}&with_genres=${
      genre.id !== '0' ? genre.id : ''
    }`,
  });

  const handleSwipe = useCallback(
    debounce(
      (
        nativeEvent: GestureHandlerGestureEventNativeEvent &
          PanGestureHandlerEventExtra
      ) => {
        if (nativeEvent.velocityX > 0)
          socket.emit('addToWatchlist', {
            senderId: user._id,
            movie: movies[movie].id,
          });

        if (movie >= movies.length)
          setPage((prev) => (prev < response.total_pages ? prev + 1 : prev));
        setMovie((prev) => (prev < movies.length - 1 ? prev + 1 : prev + 2));
      },
      200
    ),
    [movie, movies, response.total_pages]
  );

  useEffect(() => {
    setMovies((prev) => [
      ...prev,
      ...response.results
        .filter((item: any) => !user.ignoredMovies.includes(item.id))
        .filter((item: any) => !user.matchedMovies.includes(item.id)),
    ]);
  }, [response.results]);

  useEffect(() => {
    setMovie(movies.length);
  }, [genre]);

  useEffect(() => {
    if (isEmpty(movies))
      setPage((prev) => (prev < response?.total_pages ? prev + 1 : prev));
  }, [movies]);

  if (loading || isEmpty(movies) || !movies[movie])
    return (
      <View
        style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator size={40} color={theme.primary} />
      </View>
    );

  return (
    <PanGestureHandler
      activeOffsetX={[-25, 25]}
      onGestureEvent={({ nativeEvent }) => handleSwipe(nativeEvent)}
    >
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
              uri: `${imageUrl}${movies[movie]?.poster_path}`,
            }}
          />

          <InfoModal
            showModal={showModal}
            setShowModal={setShowModal}
            data={movies[movie]}
          />
        </View>
      </PanGestureHandler>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    resizeMode: 'cover',
    flex: 1,
    backgroundColor: theme.background,
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
