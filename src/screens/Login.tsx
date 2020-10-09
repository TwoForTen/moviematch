import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import theme from '../theme';
import { UserContext } from '../context/UserProvider';
import { TokenContext } from '../context/TokenProvider';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const { setToken } = useContext(TokenContext);
  const { width, height } = useWindowDimensions();

  const [active, setActive] = useState<number>(0);

  const onChange = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const active = Math.floor(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );
    setActive(active);
  };

  const signIn = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId:
          '1099080056337-4b5bgl821i3a05d3sjubbtdugnkjajda.apps.googleusercontent.com',
        androidClientId:
          '1099080056337-1rocgm0jmdq8qclu6tsnclbqsej9uob1.apps.googleusercontent.com',
          androidStandaloneAppClientId: '1099080056337-89cg8b4ao5q7rqsqavmi7t86c599o2mb.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        const {
          email,
          familyName,
          givenName,
          id,
          name,
          photoUrl,
        } = result.user;
        setToken(id || '');
        await AsyncStorage.setItem('@token', id || '');
        await axios
          .post('https://moviematch-server.herokuapp.com/api/user', {
            _id: id,
            email,
            familyName,
            givenName,
            name,
            photoUrl,
          })
          .then(({ data }) => {
            setUser(data);
          });
      } else {
        console.log('cancelled');
      }
    } catch (e) {
      await AsyncStorage.removeItem('@token').then(() => setToken(''));
      console.log('error', e);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          height: height / 1.2,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: height / 13,
        }}
      >
        <ScrollView
          horizontal
          snapToInterval={width}
          scrollEventThrottle={200}
          decelerationRate="fast"
          onMomentumScrollEnd={onChange}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View style={{ width }}>
            <Image
              style={{ width, height: width / 1.2, resizeMode: 'contain' }}
              source={require('../../assets/first_slide.png')}
            />
            <Text style={styles.title}>Swipe Movies</Text>
            <Text style={[styles.infoText, { paddingHorizontal: width / 10 }]}>
              Swipe through trending movies and create your Watchlist.
            </Text>
          </View>
          <View style={{ width }}>
            <Image
              style={{ width, height: width / 1.2, resizeMode: 'contain' }}
              source={require('../../assets/second_slide.png')}
            />
            <Text style={styles.title}>Pair Up</Text>
            <Text style={[styles.infoText, { paddingHorizontal: width / 10 }]}>
              Pair up with another person and match movies to watch together.
            </Text>
          </View>
        </ScrollView>
        <View style={styles.indicatorsContainer}>
          <View
            style={[
              styles.indicator,
              {
                backgroundColor: active === 0 ? theme.primary : theme.secondary,
              },
            ]}
          />
          <View
            style={[
              styles.indicator,
              {
                backgroundColor: active === 1 ? theme.primary : theme.secondary,
              },
            ]}
          />
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.4} onPress={signIn}>
        <View
          style={[styles.rowAlign, { paddingVertical: 10, height: height / 5 }]}
        >
          <Image
            source={require('../../assets/google.png')}
            style={styles.loginBtn}
          />
          <Text style={{ marginLeft: 10 }}>SIGN IN WITH GOOGLE</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.white,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 16,
    color: theme.secondary,
    marginTop: 5,
  },
  indicatorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    backgroundColor: theme.primary,
    borderRadius: 150,
    marginHorizontal: 4,
  },
  loginBtn: {
    width: 40,
    resizeMode: 'contain',
  },
});

export default Login;
