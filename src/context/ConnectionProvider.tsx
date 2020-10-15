import React, { createContext, useState } from 'react';

interface ConnectionType {
  connected: boolean;
  setConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConnectionContext = createContext<ConnectionType>({
  connected: false,
  setConnected: () => {},
});

const ConnectionProvider: React.FC = ({ children }) => {
  const [connected, setConnected] = useState<boolean>(false);
  return (
    <ConnectionContext.Provider value={{ connected, setConnected }}>
      {children}
    </ConnectionContext.Provider>
  );
};

export default ConnectionProvider;
