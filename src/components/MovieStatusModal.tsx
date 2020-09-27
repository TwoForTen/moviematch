import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';

import useChangeMovieStatus, {
  SwitchName,
  SwitchValues,
} from '../hooks/useChangeMovieStatus';
import theme from '../theme';
import { StatusModalContext } from '../context/StatusModalProvider';
import { UserContext } from '../context/UserProvider';

const MovieStatusModal: React.FC = () => {
  const { statusModal, setStatusModal } = useContext(StatusModalContext);
  const { user } = useContext(UserContext);
  const changeMovieStatus = useChangeMovieStatus();

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

  return (
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
              onValueChange={(value) => onSwitchChange(value, 'watchedMovies')}
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
              onValueChange={(value) => onSwitchChange(value, 'ignoredMovies')}
            />
          </View>
        </View>
        <Button title="Add to Watchlist" onPress={() => {}} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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

export default MovieStatusModal;
