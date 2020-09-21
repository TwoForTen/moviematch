import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Switch, Button } from 'react-native';
import { isEmpty } from 'lodash';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';

import useChangeMovieStatus, {
  SwitchName,
  SwitchValues,
} from '../hooks/useChangeMovieStatus';
import theme from '../theme';
import { StatusModalContext } from '../context/StatusModalProvider';
import { UserContext } from '../context/UserProvider';
import Movie from '../components/Movie/Movie';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../routes/ProfileNavigation';

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

  const switchValuesState: SwitchValues = {
    watchedMovies: user?.watchedMovies.includes(statusModal.movieId || ''),
    ignoredMovies: user?.ignoredMovies.includes(statusModal.movieId || ''),
  };

  const [switchValues, setSwitchValues] = useState<SwitchValues>(
    switchValuesState
  );

  const closeModal = (): void =>
    setStatusModal({ isOpen: false, movieId: null });

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
  }, [statusModal]);

  useEffect(() => {
    return () => closeModal();
  }, []);

  if (isEmpty(movies))
    return (
      <View
        style={[
          styles.view,
          { alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        <AntDesign name="warning" size={26} color={theme.secondary} />
        <Text style={styles.message}>List is empty</Text>
      </View>
    );

  return (
    <View style={styles.view}>
      <FlatList
        data={movies}
        renderItem={({ item }) => <Movie id={item} key={item} />}
        keyExtractor={(item) => item.toString()}
      />
      <Modal
        style={styles.modal}
        isVisible={statusModal.isOpen}
        coverScreen={false}
        hasBackdrop
        onDismiss={closeModal}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriver
      >
        <View style={styles.modalContent}>
          <View>
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
