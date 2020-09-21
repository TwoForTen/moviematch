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

import theme from '../../theme';
import useFetchData from '../../hooks/useFetchData';
import useChangeMovieStatus, {
  SwitchName,
  SwitchValues,
} from '../../hooks/useChangeMovieStatus';
import ReviewStars from '../ReviewStars';
import { UserContext } from '../../context/UserProvider';

interface Props {
  data: any;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const imageUrl: string = 'https://image.tmdb.org/t/p/w500';

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

  const { loading, response } = useFetchData({
    url: `/movie/${data.id}/videos`,
    method: 'get',
  });

  const onSwitchChange = async (
    switchValue: boolean,
    switchName: SwitchName
  ): Promise<void> => {
    changeMovieStatus(switchValue, switchName, data.id);
    setSwitchValues((prev) => {
      return {
        ...prev,
        [switchName]: !switchValues[switchName],
      };
    });
  };

  useEffect(() => {
    setSwitchValues(switchValuesState);
  }, [data.id]);

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
    >
      <View style={{ flex: 0.46 }}>
        <ScrollView scrollEventThrottle={16} style={styles.content}>
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
                  ios_backgroundColor={theme.secondary}
                  thumbColor="#fefefe"
                  value={switchValues['watchedMovies']}
                  onValueChange={(value) =>
                    onSwitchChange(value, 'watchedMovies')
                  }
                />
              </View>
              <View style={styles.watchedSection}>
                <View style={{ flexDirection: 'row' }}>
                  <AntDesign name="close" size={24} color={theme.danger} />
                  <Text style={styles.ignoreText}>Ignore</Text>
                </View>
                <Switch
                  trackColor={{ false: theme.secondary, true: theme.primary }}
                  ios_backgroundColor={theme.secondary}
                  thumbColor="#fefefe"
                  value={switchValues['ignoredMovies']}
                  onValueChange={(value) =>
                    onSwitchChange(value, 'ignoredMovies')
                  }
                />
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
  },
  releaseDate: {
    color: theme.secondary,
    marginTop: 1,
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
    color: theme.danger,
  },
});

export default InfoModal;
