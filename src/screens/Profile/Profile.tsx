import React, { useContext, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import theme from '../../theme';
import ProfileButton from '../../components/Profile/ProfileButton';
import {
  UserContext,
  User,
  initialUserState,
} from '../../context/UserProvider';
import { SocketContext } from '../../context/SocketProvider';

const Profile = () => {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const [pairedUser, setPairedUser] = useState<User>(initialUserState);
  const navigation = useNavigation();

  const unmatchAlert = () =>
    Alert.alert(
      `Unmatch`,
      `Are you sure you want to unmatch with ${pairedUser.givenName}?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Unmatch',
          onPress: () => unmatch(),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );

  useEffect(() => {
    if (!!user.matchedWith)
      axios
        .get(`http://192.168.1.6:3000/api/user?_id=${user.matchedWith.match}`)
        .then(({ data }) => setPairedUser(data))
        .catch(() => {});
    else if (!!user.sentPairRequest)
      axios
        .get(`http://192.168.1.6:3000/api/user?_id=${user.sentPairRequest}`)
        .then(({ data }) => setPairedUser(data))
        .catch(() => {});
  }, [user.sentPairRequest, user.matchedWith]);

  const deletePairRequest = useCallback(() => {
    socket.emit('deletePairRequest', {
      senderId: user._id,
      recipientId: pairedUser._id,
    });
  }, [pairedUser._id]);

  const unmatch = useCallback(() => {
    socket.emit('leaveMatch', user.matchedWith?.matchId);
    socket.emit('unmatch', {
      senderId: user._id,
      recipientId: pairedUser._id,
    });
  }, [pairedUser._id]);

  const notPaired: JSX.Element = (
    <ProfileButton
      title="Pair Up"
      icon={<AntDesign name="addusergroup" size={24} color={theme.danger} />}
      endIcon={
        <Ionicons name="ios-arrow-forward" size={24} color={theme.danger} />
      }
      warning
      pairingId={user.email.split('@')[0]}
      helperText={` is your Pairing ID`}
      onPress={() => {
        navigation.navigate('SearchUsers', {
          title: 'Find User',
          _id: user._id,
        });
      }}
    />
  );

  const requested: JSX.Element = (
    <ProfileButton
      title={pairedUser.name}
      icon={
        <>
          {!!pairedUser.photoUrl ? (
            <Image
              style={{
                height: 24,
                width: 24,
                borderRadius: 150,
                resizeMode: 'cover',
              }}
              source={{ uri: pairedUser.photoUrl }}
            />
          ) : (
            <View
              style={{
                height: 24,
                width: 24,
                borderRadius: 150,
                backgroundColor: theme.secondary,
              }}
            />
          )}
        </>
      }
      endIcon={
        <TouchableOpacity onPress={deletePairRequest}>
          <AntDesign name="deleteuser" size={24} color={theme.danger} />
        </TouchableOpacity>
      }
      success
      helperText={'Request pending'}
      onPress={() => {}}
    />
  );

  const matched: JSX.Element = (
    <ProfileButton
      title={pairedUser.name}
      icon={
        <>
          {!!pairedUser.photoUrl ? (
            <Image
              style={{
                height: 24,
                width: 24,
                borderRadius: 150,
                resizeMode: 'cover',
              }}
              source={{ uri: pairedUser.photoUrl }}
            />
          ) : (
            <View
              style={{
                height: 24,
                width: 24,
                borderRadius: 150,
                backgroundColor: theme.secondary,
              }}
            />
          )}
        </>
      }
      endIcon={
        <TouchableOpacity onPress={unmatchAlert}>
          <AntDesign name="deleteuser" size={24} color={theme.danger} />
        </TouchableOpacity>
      }
      helperText={`${pairedUser.matchedMovies.length} movies on Watchlist`}
      onPress={() => {}}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
          <View style={styles.header}>
            <Image style={styles.profileImg} source={{ uri: user.photoUrl }} />
          </View>
          <View style={styles.profileCardContainer}>
            <View style={styles.profileCard}>
              <View style={styles.info}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.email}>{user.email}</Text>
              </View>
              {!!user.sentPairRequest
                ? requested
                : !user.matchedWith
                ? notPaired
                : matched}
              {!user.matchedWith && (
                <ProfileButton
                  title="Pair requests"
                  number={user.receivedPairRequests.length}
                  icon={
                    <AntDesign name="bells" size={24} color={theme.black} />
                  }
                  endIcon={
                    <Ionicons
                      name="ios-arrow-forward"
                      size={24}
                      color={theme.black}
                    />
                  }
                  onPress={() => navigation.navigate('PairRequests')}
                />
              )}
              <ProfileButton
                title="Watched Movies"
                number={user.watchedMovies.length}
                icon={<AntDesign name="check" size={24} color={theme.black} />}
                endIcon={
                  <Ionicons
                    name="ios-arrow-forward"
                    size={24}
                    color={theme.black}
                  />
                }
                onPress={() =>
                  navigation.navigate('MovieList', {
                    movies: 'watchedMovies',
                    title: 'Watched Movies',
                  })
                }
              />
              <ProfileButton
                title="Ignored Movies"
                icon={<AntDesign name="close" size={24} color={theme.black} />}
                number={user.ignoredMovies.length}
                endIcon={
                  <Ionicons
                    name="ios-arrow-forward"
                    size={24}
                    color={theme.black}
                  />
                }
                onPress={() =>
                  navigation.navigate('MovieList', {
                    movies: 'ignoredMovies',
                    title: 'Ignored Movies',
                  })
                }
              />
            </View>
          </View>
        </View>
        <Button title="Logout" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: theme.white,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  header: {
    flex: 0.15,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  profileImg: {
    position: 'absolute',
    bottom: -60,
    height: 120,
    width: 120,
    borderRadius: 150,
    borderColor: 'white',
    borderWidth: 3,
    zIndex: 1,
  },
  profileCardContainer: {
    flex: 1,
    zIndex: -1,
    marginVertical: 10,
  },
  profileCard: {
    flex: 1,
    alignItems: 'center',
  },
  info: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomColor: 'rgba(174,191,208, 0.3)',
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    color: theme.secondary,
  },
});

export default Profile;
