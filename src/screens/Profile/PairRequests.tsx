import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { isEmpty } from 'lodash';
import axios from 'axios';

import { UserContext, User } from '../../context/UserProvider';
import EmptyList from '../../components/EmptyList';
import Request from '../../components/Profile/Request';
import theme from '../../theme';

const PairRequests = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    axios
      .post(
        `https://moviematch-server.herokuapp.com/api/user/requests`,
        {
          _ids: user.receivedPairRequests,
        },
        { cancelToken: source.token }
      )
      .then(({ data }) => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => {
      source.cancel();
    };
  }, [user.receivedPairRequests]);

  if (isEmpty(user.receivedPairRequests))
    return <EmptyList icon="user" message="No pair requests" />;

  if (loading)
    return (
      <View style={styles.spinner}>
        <ActivityIndicator size={40} color={theme.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Request data={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PairRequests;
