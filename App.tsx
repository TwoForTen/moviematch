import React from 'react';
import { StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import Login from './src/screens/Login';
import Routes from './src/routes';

export default function App() {
  const userToken = async () => await AsyncStorage.getItem('@token');

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        {!!!userToken ? <Login /> : <Routes />}
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
