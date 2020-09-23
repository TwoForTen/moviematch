import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import theme from '../theme';

interface Props {
  icon: string;
  message: string;
}

const EmptyList: React.FC<Props> = ({ icon, message }) => {
  return (
    <View style={styles.view}>
      <AntDesign name={icon} size={26} color={theme.secondary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: theme.secondary,
    fontSize: 18,
  },
});

export default EmptyList;
