import { useContext } from 'react';
import axios from 'axios';

import { UserContext } from '../context/UserProvider';

export interface SwitchValues {
  watchedMovies: boolean | undefined;
  ignoredMovies: boolean | undefined;
}

export type SwitchName = keyof SwitchValues;

const url: string = 'http://192.168.1.6:3000/api/user/movies';

const useChangeMovieStatus = () => {
  const { user, setUser } = useContext(UserContext);

  return async (switchValue: boolean, switchName: SwitchName, id: string) => {
    let result = null;
    try {
      if (switchValue)
        result = await axios.post(url, {
          _id: user._id,
          [switchName]: id,
        });
      else if (!switchValue)
        result = await axios.post(url + '/delete', {
          _id: user._id,
          [switchName]: id,
        });
      setUser(result?.data);
    } catch (err) {
      console.log(err.response);
    }
  };
};

export default useChangeMovieStatus;
