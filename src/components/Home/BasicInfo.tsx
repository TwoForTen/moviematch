import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import theme from '../../theme';
import { UserContext } from '../../context/UserProvider';
import useChangeMovieStatus, {
  SwitchName,
  SwitchValues,
} from '../../hooks/useChangeMovieStatus';
import genres from '../../utils/genres';

const { height } = Dimensions.get('screen');

interface Props {
  movie: any;
}

export const OVERFLOW_HEIGHT: number = height * 0.16;

const BasicInfo: React.FC<Props> = ({ movie }) => {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <MovieInfo movie={movie} />
    </View>
  );
};

interface MovieInfoProps {
  movie: any;
}

const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => {
  const changeMovieStatus = useChangeMovieStatus();
  const { user } = useContext(UserContext);
  const switchValuesState: SwitchValues = {
    watchedMovies: user.watchedMovies.includes(movie.id),
    ignoredMovies: user.ignoredMovies.includes(movie.id),
  };
  const [switchValues, setSwitchValues] = useState<SwitchValues>(
    switchValuesState
  );

  const onSwitchChange = async (
    value: boolean | undefined,
    name: SwitchName
  ): Promise<void> => {
    changeMovieStatus(value, name, movie.id);
    setSwitchValues((prev) => {
      return {
        ...prev,
        [name]: !switchValues[name],
      };
    });
  };

  useEffect(() => {
    setSwitchValues(switchValuesState);
  }, [movie, user.watchedMovies, user.ignoredMovies]);

  return (
    <View style={{ height: height * 0.16 }}>
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.releaseDate}>
            {movie.release_date.split('-')[0]}
          </Text>
          <Text numberOfLines={1} style={styles.title}>
            {movie.title}
          </Text>
        </View>
      </View>
      <Text numberOfLines={1} style={{ color: theme.secondary }}>
        {movie.genre_ids.map((genre: number) => genres[genre]).join(', ')}
      </Text>

      <View style={styles.statusContainer}>
        <View style={[styles.watchedSection, { marginRight: 15 }]}>
          <TouchableOpacity
            onPress={() =>
              onSwitchChange(!switchValues.watchedMovies, 'watchedMovies')
            }
          >
            <View style={styles.alignRow}>
              <AntDesign
                name="check"
                size={20}
                color={switchValues.watchedMovies ? theme.primary : 'gray'}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: switchValues.watchedMovies ? theme.primary : 'gray',
                  },
                ]}
              >
                Already watched?
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.watchedSection}>
          <TouchableOpacity
            onPress={() =>
              onSwitchChange(!switchValues.ignoredMovies, 'ignoredMovies')
            }
          >
            <View style={styles.alignRow}>
              <AntDesign
                name="close"
                size={20}
                color={switchValues.ignoredMovies ? theme.danger : 'gray'}
              />
              <Text
                style={[
                  styles.statusText,
                  {
                    color: switchValues.ignoredMovies ? theme.danger : 'gray',
                  },
                ]}
              >
                Ignore
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overflowContainer: {
    height: OVERFLOW_HEIGHT,
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    lineHeight: 33,
  },
  releaseDate: {
    // color: theme.secondary,
  },
  statusContainer: {
    borderTopColor: 'rgba(0,0,0,0.08)',
    borderTopWidth: 1,
    marginVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchedSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 16,
    paddingVertical: 10,
  },
  alignRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default BasicInfo;
