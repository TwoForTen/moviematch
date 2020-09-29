import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, AntDesign } from '@expo/vector-icons';
import axiosInstance from '../../../axiosInstance';

import theme from '../../theme';
import useDataFetch from '../../hooks/useDataFetch';
import useChangeMovieStatus, {
  SwitchName,
  SwitchValues,
} from '../../hooks/useChangeMovieStatus';
import ReviewStars from '../ReviewStars';
import { UserContext } from '../../context/UserProvider';
import genres from '../../utils/genres';

interface Props {
  data: any;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const imageUrl: string = 'https://image.tmdb.org/t/p/w500';

const fetcher = (id: string) => axiosInstance.get(`/movie/${id}/videos`);

const InfoModal: React.FC<Props> = ({ data, showModal, setShowModal }) => {
  const navigation = useNavigation();
  const changeMovieStatus = useChangeMovieStatus();
  const { user } = useContext(UserContext);

  const switchValuesState: SwitchValues = {
    watchedMovies: user.watchedMovies.includes(data.id),
    ignoredMovies: user.ignoredMovies.includes(data.id),
  };

  const [switchValues, setSwitchValues] = useState<SwitchValues>(
    switchValuesState
  );

  const { response } = useDataFetch('trailer', fetcher(data.id));

  const onSwitchChange = async (
    value: boolean | undefined,
    name: SwitchName
  ): Promise<void> => {
    changeMovieStatus(value, name, data.id);
    setSwitchValues((prev) => {
      return {
        ...prev,
        [name]: !switchValues[name],
      };
    });
  };

  useEffect(() => {
    setSwitchValues(switchValuesState);
  }, [data.id, user.watchedMovies, user.ignoredMovies]);

  if (!data) return null;

  return (
    <Modal
      onSwipeComplete={() => setShowModal(false)}
      style={styles.modal}
      isVisible={showModal}
      hasBackdrop={false}
      coverScreen={false}
      propagateSwipe
      swipeDirection={['down']}
      swipeThreshold={150}
    >
      <View style={{ flex: 0.46 }}>
        <ScrollView scrollEventThrottle={16} style={styles.content}>
          <View style={styles.hideModalIndicator} />
          <TouchableOpacity activeOpacity={1}>
            <>
              <View style={styles.titleContainer}>
                <View>
                  <Text style={styles.releaseDate}>
                    {data.release_date.split('-')[0]}
                  </Text>
                  <Text style={styles.title}>{data.title}</Text>
                </View>
                <ReviewStars rating={data.vote_average} />
              </View>
              <Text style={{ color: theme.secondary }}>
                {data.genre_ids
                  .map((genre: number) => genres[genre])
                  .join(', ')}
              </Text>

              <View style={styles.alignRow}>
                <View style={[styles.watchedSection, { marginRight: 15 }]}>
                  <TouchableOpacity
                    onPress={() =>
                      onSwitchChange(
                        !switchValues.watchedMovies,
                        'watchedMovies'
                      )
                    }
                  >
                    <View style={styles.alignRow}>
                      <AntDesign
                        name="check"
                        size={20}
                        color={
                          switchValues.watchedMovies ? theme.primary : 'gray'
                        }
                      />
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: switchValues.watchedMovies
                              ? theme.primary
                              : 'gray',
                          },
                        ]}
                      >
                        Already watched?
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.watchedSection}>
                  <TouchableOpacity
                    onPress={() =>
                      onSwitchChange(
                        !switchValues.ignoredMovies,
                        'ignoredMovies'
                      )
                    }
                  >
                    <View style={styles.alignRow}>
                      <AntDesign
                        name="close"
                        size={20}
                        color={
                          switchValues.ignoredMovies ? theme.danger : 'gray'
                        }
                      />
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: switchValues.ignoredMovies
                              ? theme.danger
                              : 'gray',
                          },
                        ]}
                      >
                        Ignore
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.overview}>
                <Text style={styles.overviewTitle}>Synopsis:</Text>
                <Text>{data.overview}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.99}
                onPress={() =>
                  navigation.navigate('Trailer', {
                    id:
                      response.results?.filter(
                        (obj: any) => obj.type === 'Trailer'
                      )[0]?.key ||
                      response.results[0]?.key ||
                      '',
                  })
                }
              >
                <ImageBackground
                  style={styles.trailer}
                  source={{ uri: imageUrl + data.backdrop_path }}
                >
                  {!!!data.backdrop_path && (
                    <View style={styles.trailerPlaceholder} />
                  )}
                  <LinearGradient
                    style={styles.gradient}
                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                  >
                    <Text style={styles.trailerTitle}>
                      {response.results?.filter(
                        (obj: any) => obj.type === 'Trailer'
                      )[0]?.name ||
                        response.results[0]?.name ||
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
    overflow: 'hidden',
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
    lineHeight: 33,
  },
  releaseDate: {
    // color: theme.secondary,
  },
  overview: {
    marginTop: 10,
  },
  overviewTitle: {
    fontWeight: 'bold',
    lineHeight: 30,
  },
  trailer: {
    height: 250,
    marginTop: 15,
    marginBottom: 30,
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trailerPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: theme.secondary,
    opacity: 0.8,
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
    paddingVertical: 13,
  },
  statusText: {
    fontSize: 17,
  },
  alignRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default InfoModal;
