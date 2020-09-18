import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Switch,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, AntDesign } from '@expo/vector-icons';

import theme from '../../theme';
import useFetchData from '../../hooks/useFetchData';
import ReviewStars from './ReviewStars';

const imageUrl: string = 'https://image.tmdb.org/t/p/w500';

const InfoModal: React.FC<any> = ({ data }) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState<boolean>(true);
  const [scrollOffset, setScrollOffset] = useState<number>();

  const { loading, response, error } = useFetchData({
    url: `/movie/${data.id}/videos`,
    method: 'get',
  });

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(e.nativeEvent.contentOffset.y);
  };

  if (loading || !data) return null;

  return (
    <Modal
      onSwipeComplete={() => setShowModal(false)}
      style={styles.modal}
      isVisible={showModal}
      hasBackdrop={false}
      coverScreen={false}
      propagateSwipe
      swipeDirection={['down']}
      scrollOffset={scrollOffset}
    >
      <View style={{ flex: 0.5 }}>
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.content}
        >
          <View style={styles.hideModalIndicator} />
          <TouchableOpacity activeOpacity={1}>
            <>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{data.title}</Text>
                <ReviewStars rating={data.vote_average} />
              </View>
              <Text style={styles.releaseDate}>
                {data.release_date.split('-')[0]}
              </Text>
              <View style={styles.watchedSection}>
                <View style={{ flexDirection: 'row' }}>
                  <AntDesign name="check" size={24} color={theme.primary} />
                  <Text style={styles.watchedText}>Already watched?</Text>
                </View>
                <Switch
                  trackColor={{ false: theme.secondary, true: theme.primary }}
                  thumbColor="#fefefe"
                />
              </View>
              <View style={styles.watchedSection}>
                <View style={{ flexDirection: 'row' }}>
                  <AntDesign name="close" size={24} color="red" />
                  <Text style={styles.ignoreText}>Ignore</Text>
                </View>
                <Switch
                  trackColor={{ false: theme.secondary, true: theme.primary }}
                  thumbColor="#fefefe"
                />
              </View>
              <Text style={styles.overview}>{data.overview}</Text>
              <TouchableOpacity
                activeOpacity={0.99}
                onPress={() =>
                  navigation.navigate('Trailer', {
                    id:
                      response.results.filter(
                        (obj: any) => obj.type === 'Trailer'
                      )[0].key ||
                      response.results[0].key ||
                      '',
                  })
                }
              >
                <ImageBackground
                  style={styles.trailer}
                  source={{ uri: imageUrl + data.backdrop_path }}
                >
                  <LinearGradient
                    style={styles.gradient}
                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                  >
                    <Text style={styles.trailerTitle}>
                      {response.results?.filter(
                        (obj: any) => obj.type === 'Trailer'
                      )[0].name ||
                        response.results[0].name ||
                        ''}
                    </Text>
                  </LinearGradient>
                  <Entypo name="controller-play" size={80} color="white" />
                </ImageBackground>
              </TouchableOpacity>
            </>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  hideModalIndicator: {
    width: 40,
    height: 7,
    borderRadius: 5,
    backgroundColor: theme.secondary,
    alignSelf: 'center',
    marginBottom: 10,
    opacity: 0.5,
  },
  content: {
    margin: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  releaseDate: {
    color: theme.secondary,
    marginTop: 1,
  },
  overview: {
    marginTop: 10,
  },
  trailer: {
    height: 250,
    marginTop: 15,
    marginBottom: 30,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailerTitle: {
    color: 'white',
    fontSize: 16,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: 10,
    paddingBottom: 20,
  },
  watchedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 13,
  },
  watchedText: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: 'bold',
    color: theme.primary,
  },
  ignoreText: {
    fontSize: 16,
    marginLeft: 5,
    fontWeight: 'bold',
    color: 'red',
  },
});

export default InfoModal;
