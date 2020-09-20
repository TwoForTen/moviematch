import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { isEmpty } from 'lodash';
import { AntDesign } from '@expo/vector-icons';
import theme from '../theme';

import Movie from '../components/Movie';
import { RouteProp } from '@react-navigation/native';
import { ProfileStackParamList } from '../routes/ProfileNavigation';

interface Props {
  route: RouteProp<ProfileStackParamList, 'MovieList'>;
}

const MovieList: React.FC<Props> = ({ route }) => {
  const {
    params: { movies },
  } = route;

  if (isEmpty(movies))
    return (
      <View
        style={[
          styles.view,
          { alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        <AntDesign name="warning" size={26} color={theme.secondary} />
        <Text style={styles.message}>List is empty</Text>
      </View>
    );

  return (
    <View style={styles.view}>
      <FlatList
        data={movies}
        renderItem={({ item }) => <Movie data={item} key={item} />}
        keyExtractor={(item) => item.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  message: {
    color: theme.secondary,
    fontSize: 18,
  },
});

export default MovieList;
