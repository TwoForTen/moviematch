import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { StatusModalContext } from '../../context/StatusModalProvider';

import theme from '../../theme';

interface Props {
  id: string;
}

const Actions: React.FC<Props> = ({ id }) => {
  const { setStatusModal } = useContext(StatusModalContext);

  return (
    <View>
      <TouchableOpacity
        style={styles.watchlist}
        activeOpacity={0.5}
        onPress={() => setStatusModal({ isOpen: true, movieId: id })}
      >
        <Text style={styles.text}>Change Status</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  watchlist: {
    elevation: 2,
    padding: 7,
    borderRadius: 100,
    backgroundColor: theme.secondary,
    flex: 3,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    color: 'white',
  },
});

export default Actions;
