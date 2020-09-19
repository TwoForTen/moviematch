import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  useWindowDimensions,
  ImageBackground,
  View,
  Text,
} from 'react-native';
import { debounce } from 'lodash';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { Entypo } from '@expo/vector-icons';

import useFetchData from '../hooks/useFetchData';
import InfoModal from '../components/Home/InfoModal';
import theme from '../theme';

const imageUrl: string = 'https://image.tmdb.org/t/p/original';

const Home = () => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [movie, setMovie] = useState<number>(0);

  const { height } = useWindowDimensions();
  const { loading, response, error } = useFetchData({
    url: '/trending/movie/week',
    method: 'get',
  });

  const handleSwipe = useCallback(
    debounce(() => setMovie((prev) => (prev < 19 ? prev + 1 : prev)), 200),
    [movie]
  );

  if (loading) return null;

  return (
    <PanGestureHandler activeOffsetX={[-25, 25]} onGestureEvent={handleSwipe}>
      <PanGestureHandler
        activeOffsetY={-100}
        onGestureEvent={({ nativeEvent }) =>
          nativeEvent.velocityY < 0 && setShowModal(true)
        }
      >
        <View style={styles.background}>
          <ImageBackground
            style={[styles.image]}
            source={{
              uri: `${imageUrl}${response.results[movie].poster_path}`,
            }}
          />
          <View style={styles.infoSwipe}>
            <Entypo name="info-with-circle" size={24} color={theme.secondary} />
            <Text style={styles.infoText}>Swipe up for info</Text>
          </View>

          <InfoModal
            showModal={showModal}
            setShowModal={setShowModal}
            data={!loading && response.results[movie]}
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
  },
  background: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
  },
  infoSwipe: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  infoText: {
    color: theme.secondary,
    fontSize: 16,
  },
});

export default Home;
