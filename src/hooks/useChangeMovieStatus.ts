import { useContext } from 'react';
import axios from 'axios';

import { UserContext } from '../context/UserProvider';

export interface SwitchValues {
  watchedMovies: boolean | undefined;
  ignoredMovies: boolean | undefined;
}

export type SwitchName = keyof SwitchValues;

const url: string = 'https://moviematch-server.herokuapp.com/api/user/movies';

const useChangeMovieStatus = () => {
  const { user, setUser } = useContext(UserContext);

  return async (value: boolean | undefined, name: SwitchName, id: string) => {
    let result = null;
    try {
      if (value)
        result = await axios.post(url, {
          _id: user._id,
          [name]: id,
        });
      else if (!value)
        result = await axios.post(url + '/delete', {
          _id: user._id,
          [name]: id,
        });
      setUser(result?.data);
    } catch (err) {
      console.log(err.response);
    }
  };
};

export default useChangeMovieStatus;
