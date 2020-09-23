import React, { useState, useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AppLoading } from 'expo';
import axios from 'axios';

import Login from './Login';
import Routes from '../routes';
import { UserContext, User } from '../context/UserProvider';
import { SocketContext } from '../context/SocketProvider';
import theme from '../theme';

const Splash = () => {
  const [appReady, setAppReady] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const { user, setUser } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if (!!user._id) {
      socket.emit('clientJoined', user._id);
      socket.on('userStateUpdate', (user: User) => {
        setUser(user);
      });

      if (!!user.matchedWith) {
        socket.emit('joinMatch', user.matchedWith.matchId);
        socket.on('matchedMovie', (movie: number) => console.log(movie));
      }
    }
  }, [user._id, user.matchedWith?.matchId]);

  const userToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      if (!!storedToken) {
        setToken(storedToken);
        axios
          .get(`http://192.168.1.6:3000/api/user?_id=${storedToken}`)
          .then(({ data }) => {
            if (!data) {
              setToken('');
              return;
            }
            setUser(data);
          })
          .catch(async () => {
            await AsyncStorage.removeItem('@token');
            setToken('');
            throw new Error('something went wrong');
          });
      } else {
        setToken('');
        throw new Error('No token stored');
      }
    } catch (err) {
      setToken('');
      console.log(err.message);
    }
  };

  if (!appReady)
    return (
      <AppLoading startAsync={userToken} onFinish={() => setAppReady(true)} />
    );

  return (
    <>
      {!!!user._id && !!!token ? (
        <Login />
      ) : !!!user._id && !!token ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size={40} color={theme.primary} />
        </View>
      ) : (
        <Routes />
      )}
    </>
  );
};

export default Splash;
