import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, UIManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Splash from './src/screens/Splash';
import UserProvider from './src/context/UserProvider';
import ConnectionProvider from './src/context/ConnectionProvider';
import StatusModalProvider from './src/context/StatusModalProvider';
import SocketProvider from './src/context/SocketProvider';
import GenreProvider from './src/context/GenreProvider';
import TokenProvider from './src/context/TokenProvider';
import theme from './src/theme';

export default function App() {
  useEffect(() => {
    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  return (
    <NavigationContainer>
      <ConnectionProvider>
        <TokenProvider>
          <UserProvider>
            <SocketProvider>
              <StatusModalProvider>
                <GenreProvider>
                  <View style={styles.container}>
                    <Splash />
                  </View>
                </GenreProvider>
              </StatusModalProvider>
            </SocketProvider>
          </UserProvider>
        </TokenProvider>
      </ConnectionProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
});
