import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, UIManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Splash from './src/screens/Splash';
import UserProvider from './src/context/UserProvider';
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
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
});
