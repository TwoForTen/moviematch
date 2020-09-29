import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
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
    setStatusModal({ isOpen: false, movieId: null, title: '', year: '' });

  const onSwitchChange = async (
    value: boolean,
    name: SwitchName
  ): Promise<void> => {
    changeMovieStatus(value, name, statusModal.movieId || '');
    setSwitchValues((prev) => {
      return {
        ...prev,
        [name]: !switchValues[name],
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
          <Text>{statusModal.year}</Text>
          <Text style={styles.title}>{statusModal.title}</Text>
          <View style={styles.alignRow}>
            <View style={[styles.watchedSection, { marginRight: 15 }]}>
              <TouchableOpacity
                onPress={() =>
                  onSwitchChange(!switchValues.watchedMovies, 'watchedMovies')
                }
              >
                <View style={styles.alignRow}>
                  <AntDesign
                    name="check"
                    size={20}
                    color={switchValues.watchedMovies ? theme.primary : 'gray'}
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
                  onSwitchChange(!switchValues.ignoredMovies, 'ignoredMovies')
                }
              >
                <View style={styles.alignRow}>
                  <AntDesign
                    name="close"
                    size={20}
                    color={switchValues.ignoredMovies ? theme.danger : 'gray'}
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
  alignRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  watchedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 13,
  },
  statusText: {
    fontSize: 16,
  },
});

export default MovieStatusModal;
