import React, { useCallback, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { UserContext, User } from '../../context/UserProvider';
import theme from '../../theme';
import { SocketContext } from '../../context/SocketProvider';

interface Props {
  data: User;
}

const Request: React.FC<Props> = ({ data }) => {
  const {
    user: { _id },
  } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const navigation = useNavigation();

  const matchWithUser = useCallback(() => {
    socket.emit('match', { senderId: _id, recipientId: data._id });
    navigation.navigate('Profile');
  }, []);

  const declinePairRequest = useCallback(() => {
    socket.emit('declinePairRequest', { senderId: _id, recipientId: data._id });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image style={styles.image} source={{ uri: data.photoUrl }} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.email}>{data.email}</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <TouchableOpacity onPress={declinePairRequest}>
          <AntDesign
            style={styles.icon}
            name="closecircleo"
            size={26}
            color={theme.danger}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={matchWithUser}>
          <AntDesign
            style={styles.icon}
            name="checkcircleo"
            size={26}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 40,
    width: 40,
    resizeMode: 'cover',
    borderRadius: 150,
  },
  textContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
  },
  email: {
    fontSize: 13,
    color: theme.secondary,
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default Request;
