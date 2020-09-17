import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { NavigationContainer } from '@react-navigation/native';

import Login from './src/screens/Login';
import BottomNavigation from './src/components/BottomNavigation';

export default function App() {
  const [userToken, setUserToken] = useState<string>('');
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        setUserToken(token || '');
      } catch (err) {
        console.log(err);
      }
    };

    checkAuth();
  }, []);

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        {!!!userToken ? <Login /> : <BottomNavigation />}
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
