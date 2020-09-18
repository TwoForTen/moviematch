import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import io from 'socket.io-client';

import Splash from './src/screens/Splash';
import UserProvider from './src/context/UserProvider';
import theme from './src/theme';

export default function App() {
  return (
    <NavigationContainer>
      <UserProvider>
        <View style={styles.container}>
          <Splash />
        </View>
      </UserProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
});
