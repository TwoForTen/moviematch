import React, { createContext, useState } from 'react';

type User = null | {
  _id: string;
  email: string;
  familyName: string;
  givenName: string;
  name: string;
  photoUrl: string;
  matchedWith: string;
  matchedMovies: string[];
  watchedMovies: string[];
};

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
