import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Switch,
  Button,
  LayoutAnimation,
} from 'react-native';
import { isEmpty, sortBy } from 'lodash';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import useChangeMovieStatus, {
  SwitchName,
  SwitchValues,
} from '../hooks/useChangeMovieStatus';
import theme from '../theme';
import { StatusModalContext } from '../context/StatusModalProvider';
import { UserContext, User, initialUserState } from '../context/UserProvider';
import Movie from '../components/Movie/Movie';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../routes/ProfileNavigation';
import EmptyList from '../components/EmptyList';

interface Props {
  route: RouteProp<ProfileStackParamList, 'MovieList'>;
}

const MovieList: React.FC<Props> = ({ route }) => {
  const { statusModal, setStatusModal } = useContext(StatusModalContext);
  const { user } = useContext(UserContext);
  const changeMovieStatus = useChangeMovieStatus();
  const {
    params: { movies },
  } = route;
  const [pairedUser, setPairedUser] = useState<User>(initialUserState);
  const [focused, setFocused] = useState<boolean>(true);
  const navigation = useNavigation();

  const memoizedUser = useMemo(() => user, [statusModal.isOpen, focused]);

  const switchValuesState: SwitchValues = {
    watchedMovies: user?.watchedMovies.includes(statusModal.movieId || ''),
    ignoredMovies: user?.ignoredMovies.includes(statusModal.movieId || ''),
  };

  const [switchValues, setSwitchValues] = useState<SwitchValues>(
    switchValuesState
  );

  const closeModal = (): void =>
    setStatusModal({ isOpen: false, movieId: null, title: '' });

  const onSwitchChange = async (
    switchValue: boolean,
    switchName: SwitchName
  ): Promise<void> => {
    changeMovieStatus(switchValue, switchName, statusModal.movieId || '');
    setSwitchValues((prev) => {
      return {
        ...prev,
        [switchName]: !switchValues[switchName],
      };
    });
  };

  useEffect(() => {
    setSwitchValues(switchValuesState);
  }, [statusModal.movieId]);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    navigation.addListener('focus', () => setFocused(true));
    navigation.addListener('blur', () => setFocused(false));

    if (user.matchedWith) {
      axios
        .get(`http://192.168.1.6:3000/api/user?_id=${user.matchedWith.match}`)
        .then(({ data }) => {
          setPairedUser(data);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        })
        .catch(() => {});
    } else {
      setPairedUser(initialUserState);
    }

    return () => {
      source.cancel();
      navigation.removeListener('focus', () => setFocused(true));
      navigation.addListener('blur', () => setFocused(false));
    };
  }, []);

  if (isEmpty(memoizedUser[movies]))
    return <EmptyList icon="warning" message="List is empty" />;

  return (
    <View style={styles.view}>
      <FlatList
        data={sortBy(
          [...memoizedUser[movies]],
          [(item) => pairedUser.matchedMovies.includes(item)]
        ).reverse()}
        renderItem={({ item }) => (
          <Movie
            id={item}
            key={item}
            match={
              pairedUser.matchedMovies.includes(item)
                ? pairedUser.givenName
                : ''
            }
          />
        )}
        keyExtractor={(item) => item.toString()}
      />
      <Modal
        style={styles.modal}
        isVisible={statusModal.isOpen}
        onDismiss={closeModal}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View style={styles.modalContent}>
          <View>
            <Text style={styles.title}>{statusModal.title}</Text>
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
          </View>
          <Button title="Add to Watchlist" onPress={() => {}} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: theme.background,
  },
  message: {
    color: theme.secondary,
    fontSize: 18,
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    flex: 0.3,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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

export default MovieList;
