import React, { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { AppLoading } from 'expo';
import axios from 'axios';

import Login from './Login';
import Routes from '../routes';
import { UserContext, User } from '../context/UserProvider';
import { SocketContext } from '../context/SocketProvider';

const Splash = () => {
  const [appReady, setAppReady] = useState<boolean>(false);
  const { user, setUser } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    socket.emit('clientJoined', user._id);
    socket.on('userStateUpdate', (user: User) => {
      console.log(user);
      setUser(user);
    });
  }, []);

  const userToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      if (!!storedToken) {
        axios
          .get(`http://192.168.1.6:3000/api/user?_id=${storedToken}`)
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

  return <>{!!!user._id ? <Login /> : <Routes />}</>;
};

export default Splash;
