import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, Button, StatusBar } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import theme from '../../theme';
import ProfileButton from '../../components/Profile/ProfileButton';
import { UserContext } from '../../context/UserProvider';

const Profile = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: theme.background,
      }}
    >
      <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
        <View style={styles.header}>
          <Image style={styles.profileImg} source={{ uri: user?.photoUrl }} />
        </View>
        <View style={styles.profileCardContainer}>
          <View style={styles.profileCard}>
            <View style={styles.info}>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
            <ProfileButton
              title="Pair Up"
              icon={<AntDesign name="addusergroup" size={24} color="red" />}
              endIcon={
                <Ionicons name="ios-arrow-forward" size={24} color={'red'} />
              }
              warning
              helperText="Find someone to match movies with"
              onPress={() => {}}
            />
            <ProfileButton
              title="Watched Movies"
              number={user?.watchedMovies.length}
              icon={<AntDesign name="check" size={24} color="black" />}
              endIcon={
                <Ionicons name="ios-arrow-forward" size={24} color={'black'} />
              }
              onPress={() =>
                navigation.navigate('MovieList', {
                  movies: user?.watchedMovies,
                })
              }
            />
            <ProfileButton
              title="Ignored Movies"
              icon={<AntDesign name="close" size={24} color="black" />}
              number={user?.ignoredMovies.length}
              endIcon={
                <Ionicons name="ios-arrow-forward" size={24} color={'black'} />
              }
              onPress={() =>
                navigation.navigate('MovieList', {
                  movies: user?.ignoredMovies,
                })
              }
            />
          </View>
        </View>
      </View>
      <Button title="Logout" onPress={() => {}} color={'black'} />
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginHorizontal: 20,
    zIndex: -1,
    marginVertical: 10,
  },
  profileCard: {
    // elevation: 3,
    flex: 1,
    // backgroundColor: 'white',
    borderRadius: 20,
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
