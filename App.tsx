import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import io from 'socket.io-client';
import { AppLoading } from 'expo';

import Login from './src/screens/Login';
import Routes from './src/routes';
import UserProvider from './src/context/UserProvider';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [appReady, setAppReady] = useState<boolean>(false);

  const userToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      if (!!storedToken) setToken(storedToken);
      else throw new Error('No token stored');
    } catch (err) {
      console.log(err.message);
    }
  };

  if (!appReady)
    return (
      <AppLoading startAsync={userToken} onFinish={() => setAppReady(true)} />
    );

  return (
    <NavigationContainer>
      <UserProvider>
        <View style={styles.container}>
          {!!!token ? <Login /> : <Routes />}
        </View>
      </UserProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
