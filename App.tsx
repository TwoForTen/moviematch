import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, UIManager } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Splash from './src/screens/Splash';
import UserProvider from './src/context/UserProvider';
import StatusModalProvider from './src/context/StatusModalProvider';
import SocketProvider from './src/context/SocketProvider';
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
      <UserProvider>
        <SocketProvider>
          <StatusModalProvider>
            <View style={styles.container}>
              <Splash />
            </View>
          </StatusModalProvider>
        </SocketProvider>
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
