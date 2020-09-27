import React, { createContext, useState } from 'react';

export interface Genre {
  id: string;
  name: string;
}

interface StatusModalContextType {
  genre: Genre;
  setGenre: React.Dispatch<React.SetStateAction<Genre>>;
}

export const GenreContext = createContext<StatusModalContextType>({
  genre: {
    id: '0',
    name: 'Trending',
  },
  setGenre: () => {},
});

const GenreProvider: React.FC = ({ children }) => {
  const [genre, setGenre] = useState<Genre>({
    id: '0',
    name: 'Trending',
  });
  return (
    <GenreContext.Provider value={{ genre, setGenre }}>
      {children}
    </GenreContext.Provider>
  );
};

export default GenreProvider;
