import React, { useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { isEmpty } from 'lodash';
import axiosInstance from '../../../axiosInstance';

import useDataFetch from '../../hooks/useDataFetch';
import InfoModal from '../../components/Home/InfoModal';
import theme from '../../theme';
import { UserContext } from '../../context/UserProvider';
import { GenreContext } from '../../context/GenreProvider';

import MovieCards from '../../components/Home/MovieCards';

const genreFetcher = (page: number, genre: string) =>
  axiosInstance.get(`/discover/movie?page=${page}&with_genres=${genre}`);

const trendingFetcher = (page: number) =>
  axiosInstance.get(`/trending/movie/day?page=${page}`);

const Home = () => {
  const [showModal, setShowModal] = useState<boolean>(true);
  const [active, setActive] = useState<number>(0);
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const { user } = useContext(UserContext);
  const { genre } = useContext(GenreContext);

  const { loading, response } = useDataFetch(
    [genre.name, page],
    genre.id === '0' ? trendingFetcher(page) : genreFetcher(page, genre.id)
  );

  useEffect(() => {
    setMovies([
      ...response.results
        .filter((item: any) => !user.ignoredMovies.includes(item.id))
        .filter((item: any) => !user.matchedMovies.includes(item.id)),
    ]);
  }, [response.results]);

  useEffect(() => {
    setPage(1);
    setActive(0);
  }, [genre]);

  useEffect(() => {
    if (isEmpty(movies))
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
    <>
      {movies.map((movie, index) => {
        return (
          index >= active && (
            <MovieCards
              index={index}
              active={active}
              setActive={setActive}
              movie={movie}
              key={movie.id}
            />
          )
        );
      })}
    </>
  );
};

export default Home;
