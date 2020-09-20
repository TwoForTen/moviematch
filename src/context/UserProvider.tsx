import React, { createContext, useState } from 'react';

type User = {
  _id: string;
  email: string;
  familyName: string;
  givenName: string;
  name: string;
  photoUrl: string;
  matchedWith: string | null;
  matchedMovies: string[] | null;
  watchedMovies: string[];
  ignoredMovies: string[];
};

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContextType>({
  user: {
    _id: '',
    email: '',
    familyName: '',
    givenName: '',
    name: '',
    photoUrl: '',
    matchedWith: null,
    matchedMovies: null,
    watchedMovies: [],
    ignoredMovies: [],
  },
  setUser: () => {},
});

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>({
    _id: '',
    email: '',
    familyName: '',
    givenName: '',
    name: '',
    photoUrl: '',
    matchedWith: null,
    matchedMovies: null,
    watchedMovies: [],
    ignoredMovies: [],
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
