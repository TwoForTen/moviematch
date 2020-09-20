import React, { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { AppLoading } from 'expo';
import axios from 'axios';

import Login from './Login';
import Routes from '../routes';
import { UserContext } from '../context/UserProvider';

const Splash = () => {
  const [appReady, setAppReady] = useState<boolean>(false);
  const { user, setUser } = useContext(UserContext);

  const userToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      if (!!storedToken) {
        axios
          .get(`http://192.168.1.6:3000/api/userid=${storedToken}`)
          .then(({ data }) => {
            setUser(data);
          })
          .catch(() => {
            throw new Error('Something went wrong');
          });
      } else throw new Error('No token stored');
    } catch (err) {
      console.log(err.message);
    }
  };

  if (!appReady)
    return (
      <AppLoading startAsync={userToken} onFinish={() => setAppReady(true)} />
    );

  return <>{!user ? <Login /> : <Routes />}</>;
};

export default Splash;
