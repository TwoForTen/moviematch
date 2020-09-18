import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import * as Google from 'expo-google-app-auth';
import AsyncStorage from '@react-native-community/async-storage';

const Login = () => {
  const signIn = async () => {
    try {
      const result = await Google.logInAsync({
        iosClientId:
          '1099080056337-4b5bgl821i3a05d3sjubbtdugnkjajda.apps.googleusercontent.com',
        androidClientId:
          '1099080056337-1rocgm0jmdq8qclu6tsnclbqsej9uob1.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });

      if (result.type === 'success') {
        await AsyncStorage.setItem('@token', result.user.id || '');
      } else {
        console.log('cancelled');
      }
    } catch (e) {
      console.log('error', e);
    }
  };
  return (
    <View style={styles.container}>
      {/* <ImageBackground
        style={styles.bg}
        blurRadius={1}
        source={require('../../assets/loginBg.jpg')}
      > */}
      {/* <View style={styles.backdrop} /> */}
      <TouchableOpacity activeOpacity={0.9} onPress={() => signIn()}>
        <Image
          source={require('../../assets/google.png')}
          style={styles.image}
        />
      </TouchableOpacity>
      {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 240,
    resizeMode: 'contain',
  },
});

export default Login;
