import React, { createContext, useState } from 'react';

export type User = {
  _id: string;
  email: string;
  familyName: string;
  givenName: string;
  name: string;
  photoUrl: string;
  matchedWith: string | null;
  sentPairRequest: string | null;
  receivedPairRequests: string[];
  matchedMovies: string[];
  watchedMovies: string[];
  ignoredMovies: string[];
};

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const initialUserState = {
  _id: '',
  email: '',
  familyName: '',
  givenName: '',
  name: '',
  photoUrl: '',
  matchedWith: null,
  sentPairRequest: null,
  receivedPairRequests: [],
  matchedMovies: [],
  watchedMovies: [],
  ignoredMovies: [],
};

export const UserContext = createContext<UserContextType>({
  user: initialUserState,
  setUser: () => {},
});

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>(initialUserState);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
