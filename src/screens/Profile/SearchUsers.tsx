import React, { useState, useCallback, useContext } from 'react';
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

import theme from '../../theme';
import { SocketContext } from '../../context/SocketProvider';
import { UserContext, User } from '../../context/UserProvider';

const SearchUsers: React.FC = () => {
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    user: { _id, matchedWith, sentPairRequest, receivedPairRequests },
  } = useContext(UserContext);
  const { socket } = useContext(SocketContext);

  const searchUsers = useCallback(
    debounce((text: string) => {
      setLoading(true);
      if (text.length > 0)
        axios
          .get(`https://moviematch-server.herokuapp.com/api/users/pair?q=${text}&_id=${_id}`)
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

  const sendPairRequest = useCallback((recipientId: string) => {
    socket.emit('pairRequest', { senderId: _id, recipientId });
  }, []);

  const deletePairRequest = useCallback((recipientId: string) => {
    socket.emit('deletePairRequest', { senderId: _id, recipientId });
  }, []);

  const matchWithUser = useCallback((recipientId: string) => {
    socket.emit('match', { senderId: _id, recipientId });
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          {
            borderBottomColor: !inputFocused ? theme.secondary : theme.black,
          },
        ]}
      >
        <AntDesign
          name="search1"
          size={24}
          color={!inputFocused ? theme.secondary : theme.black}
        />
        <TextInput
          style={styles.input}
          placeholder="Search by Pairing ID"
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          autoCapitalize="none"
          autoFocus
          onChangeText={(text) => {
            searchUsers(text);
          }}
        />
        {loading && <ActivityIndicator color={theme.primary} />}
      </View>
      <ScrollView>
        {users.map((user: User) => (
          <View style={styles.userContainer} key={user._id}>
            <Image style={styles.userImage} source={{ uri: user.photoUrl }} />
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
            {receivedPairRequests.includes(user._id) ? (
              <TouchableOpacity onPress={matchWithUser.bind(this, user._id)}>
                <AntDesign name="adduser" size={24} color={theme.primary} />
              </TouchableOpacity>
            ) : sentPairRequest === user._id ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={deletePairRequest.bind(this, user._id)}
              >
                <AntDesign name="deleteuser" size={24} color={theme.danger} />
              </TouchableOpacity>
            ) : !matchedWith && !sentPairRequest && !user.matchedWith ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={sendPairRequest.bind(this, user._id)}
              >
                <AntDesign name="adduser" size={24} color={theme.black} />
              </TouchableOpacity>
            ) : matchedWith?.matchId ?? user.matchedWith?.matchId ? (
              <AntDesign name="check" size={24} color={theme.primary} />
            ) : (
              <AntDesign
                name="adduser"
                size={24}
                color={theme.secondary}
                style={{ opacity: 0.5 }}
              />
            )}
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
