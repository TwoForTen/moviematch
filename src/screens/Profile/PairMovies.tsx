import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  LayoutAnimation,
  ActivityIndicator,
} from 'react-native';
import { isEmpty, sortBy } from 'lodash';
import axios from 'axios';

import theme from '../../theme';
import {
  UserContext,
  User,
  initialUserState,
} from '../../context/UserProvider';
import Movie from '../../components/Movie/Movie';
import EmptyList from '../../components/EmptyList';
import MovieStatusModal from '../../components/MovieStatusModal';

const MovieList: React.FC = () => {
  const { user } = useContext(UserContext);
  const [pairedUser, setPairedUser] = useState<User>(initialUserState);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    let mounted: boolean = true;

    if (user.matchedWith) {
      axios
        .get(`https://moviematch-server.herokuapp.com/api/user?_id=${user.matchedWith.match}`)
        .then(({ data }) => {
          setPairedUser(data);
          setLoading(false);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        })
        .catch(() => setLoading(false));
    } else {
      setPairedUser(initialUserState);
    }

    return () => {
      source.cancel();
      mounted = false;
    };
  }, [user.matchedWith?.match, user.matchedMovies]);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={40} color={theme.secondary} />
      </View>
    );

  if (isEmpty(pairedUser.matchedMovies))
    return <EmptyList icon="warning" message="List is empty" />;

  return (
    <View style={styles.view}>
      <FlatList
        data={sortBy(
          [...pairedUser.matchedMovies],
          [(item) => user.matchedMovies.includes(item)]
        ).reverse()}
        renderItem={({ item }) => (
          <Movie
            id={item}
            key={item}
            match={user.matchedMovies.includes(item) ? 'You' : ''}
          />
        )}
        keyExtractor={(item) => item.toString()}
      />
      <MovieStatusModal />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieList;
