import React, { createContext, useState } from 'react';

interface TokenContextType {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export const TokenContext = createContext<TokenContextType>({
  token: '',
  setToken: () => {},
});

const UserProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string>('');
  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

export default UserProvider;
