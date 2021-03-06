import React, { createContext } from 'react';
import io from 'socket.io-client';

interface SocketType {
  socket: SocketIOClient.Socket;
}

export const SocketContext = createContext<SocketType>({ socket: io() });

const SocketProvider: React.FC = ({ children }) => {
  const socket = io('https://moviematch-server.herokuapp.com', {
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: Infinity,
    forceNew: true,
  });

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
