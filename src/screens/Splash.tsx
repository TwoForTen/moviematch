import React, { useState, useContext, useEffect, memo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AppLoading } from 'expo';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

import axiosInstance from '../../axiosInstance';
import Login from './Login';
import Routes from '../routes';
import { UserContext, User } from '../context/UserProvider';
import { SocketContext } from '../context/SocketProvider';
import { TokenContext } from '../context/TokenProvider';
import { ConnectionContext } from '../context/ConnectionProvider';
import theme from '../theme';
import Snackbar from '../components/Snackbar';

export interface SnackbarType {
  show: boolean;
  image: string;
  movieTitle: string;
}

const Splash = memo(() => {
  const [appReady, setAppReady] = useState<boolean>(false);
  const { token, setToken } = useContext(TokenContext);
  const [{ show, image, movieTitle }, setSnackbar] = useState<SnackbarType>({
    show: false,
    image: '',
    movieTitle: '',
  });
  const { user, setUser } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const { connected, setConnected } = useContext(ConnectionContext);

  useEffect(() => {
    const networkInfoUnsub = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });
    if (!!user._id && connected) {
      socket.connect();
      socket.emit('clientJoined', user._id);
      // socket.addEventListener('connect', () => {
      //   socket.emit('clientJoined', user._id);
      //   if (!!user.matchedWith)
      //     socket.emit('joinMatch', user.matchedWith.matchId);
      // });
      socket.on('userStateUpdate', (user: User) => {
        setUser(user);
      });

      if (!!user.matchedWith) {
        socket.emit('joinMatch', user.matchedWith.matchId);
        socket.on('matchedMovie', (movie: number) => {
          axiosInstance
            .get(`/movie/${movie}`)
            .then(({ data }) =>
              setSnackbar({
                show: true,
                image: data.poster_path,
                movieTitle: data.title,
              })
            )
            .catch(() => {});
        });
      }
    }
    return () => networkInfoUnsub();
  }, [user._id, user.matchedWith?.matchId, connected]);

  const userToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@token');
      if (!!storedToken) {
        setToken(storedToken);
        axios
          .get(
            `https://moviematch-server.herokuapp.com/api/user?_id=${storedToken}`
          )
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
        <>
          <Snackbar
            isVisible={show}
            image={image}
            movieTitle={movieTitle}
            setSnackbar={setSnackbar}
          />
          <Routes />
        </>
      )}
    </>
  );
});

export default Splash;
