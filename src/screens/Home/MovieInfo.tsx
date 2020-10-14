import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import {
  Directions,
  FlingGestureHandler,
  State,
} from 'react-native-gesture-handler';

import { RootStackParamList } from '../../routes/HomeNavigation';
import InfoModal from '../../components/Home/InfoModal';

type MovieInfoScreenRouteProp = RouteProp<RootStackParamList, 'MovieInfo'>;

interface Props {
  route: MovieInfoScreenRouteProp;
}

const IMAGE_URL: string = 'https://image.tmdb.org/t/p/original';

const MovieInfo: React.FC<Props> = ({ route }) => {
  const {
    params: { movie },
  } = route;
  const [showModal, setShowModal] = useState<boolean>(true);
  const navigation = useNavigation();

  return (
    <FlingGestureHandler
      direction={Directions.UP}
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.END) {
          setShowModal((prev) => !prev && true);
        }
      }}
    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
        >
          <Image
            fadeDuration={0}
            style={styles.image}
            source={{ uri: IMAGE_URL + movie.poster_path }}
          />
        </TouchableOpacity>
        <InfoModal
          data={movie}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      </View>
    </FlingGestureHandler>
  );
};

const styles = StyleSheet.create({
  image: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
});

export default MovieInfo;
