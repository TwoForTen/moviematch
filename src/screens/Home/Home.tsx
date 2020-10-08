import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { isEmpty } from 'lodash';
import axiosInstance from '../../../axiosInstance';
import Animated, { useCode } from 'react-native-reanimated';

import useDataFetch from '../../hooks/useDataFetch';
import InfoModal from '../../components/Home/InfoModal';
import BasicInfo from '../../components/Home/BasicInfo';
import theme from '../../theme';
import { UserContext } from '../../context/UserProvider';
import { GenreContext } from '../../context/GenreProvider';

import MovieCards from '../../components/Home/MovieCards';
import runSpring from '../../utils/springAnimation';

const genreFetcher = (page: number, genre: string) =>
  axiosInstance.get(`/discover/movie?page=${page}&with_genres=${genre}`);

const trendingFetcher = (page: number) =>
  axiosInstance.get(`/trending/movie/day?page=${page}`);

const Home = () => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [movies, setMovies] = useState<any[]>([]);
  const scrollXAnimated = new Animated.Value(0);
  const [page, setPage] = useState(1);
  const { user } = useContext(UserContext);
  const { genre } = useContext(GenreContext);

  const { loading, response } = useDataFetch(
    [genre.name, page],
    genre.id === '0' ? trendingFetcher(page) : genreFetcher(page, genre.id)
  );

  const reversedMovies = useMemo(() => [...movies].reverse(), [movies]);
  useEffect(() => {
    setMovies([
      ...response.results
        .filter((item: any) => !user.ignoredMovies.includes(item.id))
        .filter((item: any) => !user.matchedMovies.includes(item.id)),
    ]);
  }, [response.results]);

  useEffect(() => {
    setPage(1);
  }, [genre]);

  useEffect(() => {
    if (isEmpty(movies))
      setPage((prev) => (prev < response?.total_pages ? prev + 1 : prev));

    if (movies.length === 0)
      setPage((prev) => (prev < response?.total_pages ? prev + 1 : prev));
  }, [movies]);

  if (loading || isEmpty(movies))
    return (
      <View
        style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}
      >
        <ActivityIndicator size={40} color={theme.primary} />
      </View>
    );

  return (
    <View style={{ justifyContent: 'flex-end', flex: 1 }}>
      {reversedMovies.map((movie, index) => {
        return (
          <MovieCards
            index={index}
            setMovies={setMovies}
            movie={movie}
            key={movie.id}
          />
        );
      })}
      <BasicInfo scrollXAnimated={scrollXAnimated} movies={movies} />
    </View>
  );
};

export default Home;
