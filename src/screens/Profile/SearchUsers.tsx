import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { debounce } from 'lodash';
import axios from 'axios';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../../routes/ProfileNavigation';

import theme from '../../theme';

type TrailerScreenRouteProp = RouteProp<ProfileStackParamList, 'SearchUsers'>;

interface Props {
  route: TrailerScreenRouteProp;
}

const SearchUsers: React.FC<Props> = ({ route }) => {
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    params: { _id },
  } = route;

  const searchUsers = useCallback(
    debounce((text: string) => {
      setLoading(true);
      if (text.length > 0)
        axios
          .get(`http://192.168.1.6:3000/api/users?q=${text}&_id=${_id}`)
          .then(({ data }) => {
            setUsers(data);
            setLoading(false);
          })
          .catch(() => {
            console.log('err');
            setLoading(false);
          });
      else {
        setUsers([]);
        setLoading(false);
      }
    }, 600),
    []
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderBottomColor: !inputFocused ? theme.secondary : 'black',
          },
        ]}
      >
        <AntDesign
          name="search1"
          size={24}
          color={!inputFocused ? theme.secondary : 'black'}
        />
        <TextInput
          style={styles.input}
          placeholder="Search by Name or Email..."
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          autoFocus
          onChangeText={(text) => {
            searchUsers(text);
          }}
        />
        {loading && <ActivityIndicator color={theme.primary} />}
      </View>
      <ScrollView>
        {users.map((user) => (
          <View style={styles.userContainer} key={user._id}>
            <Image style={styles.userImage} source={{ uri: user.photoUrl }} />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <AntDesign name="adduser" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    flex: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  userImage: {
    height: 50,
    width: 50,
    borderRadius: 150,
    resizeMode: 'cover',
  },
  userInfo: {
    marginHorizontal: 10,
    flex: 2,
  },
  name: {
    fontSize: 16,
  },
  email: {
    color: theme.secondary,
    fontSize: 14,
  },
  addButton: { flex: 0.3, alignItems: 'flex-end' },
});

export default SearchUsers;
