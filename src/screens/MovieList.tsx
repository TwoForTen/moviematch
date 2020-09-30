import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { View, FlatList, StyleSheet, LayoutAnimation } from 'react-native';
import { isEmpty, sortBy } from 'lodash';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import theme from '../theme';
import { StatusModalContext } from '../context/StatusModalProvider';
import { UserContext, User, initialUserState } from '../context/UserProvider';
import Movie from '../components/Movie/Movie';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../routes/ProfileNavigation';
import EmptyList from '../components/EmptyList';
import MovieStatusModal from '../components/MovieStatusModal';

interface Props {
  route: RouteProp<ProfileStackParamList, 'MovieList'>;
}

const MovieList: React.FC<Props> = ({ route }) => {
  const { statusModal } = useContext(StatusModalContext);
  const { user } = useContext(UserContext);
  const {
    params: { movies },
  } = route;
  const [pairedUser, setPairedUser] = useState<User>(initialUserState);
  const [focused, setFocused] = useState<boolean>(true);
  const navigation = useNavigation();

  const memoizedUser = useMemo(() => user, [statusModal.isOpen, focused]);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    let mounted: boolean = true;

    if (user.matchedWith) {
      axios
        .get(`http://192.168.1.6:3000/api/user?_id=${user.matchedWith.match}`)
        .then(({ data }) => {
          setPairedUser(data);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        })
        .catch(() => {});
    } else {
      setPairedUser(initialUserState);
    }

    return () => {
      source.cancel();
      mounted = false;
    };
  }, [user.matchedWith?.match, user.matchedMovies]);

  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, [navigation])
  );

  if (isEmpty(memoizedUser[movies]))
    return <EmptyList icon="warning" message="List is empty" />;

  return (
    <View style={styles.view}>
      <FlatList
        data={sortBy(
          [...memoizedUser[movies]],
          [(item) => pairedUser.matchedMovies.includes(item)]
        ).reverse()}
        renderItem={({ item }) => (
          <Movie
            id={item}
            key={item}
            match={
              pairedUser.matchedMovies.includes(item)
                ? pairedUser.givenName
                : ''
            }
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
});

export default MovieList;
