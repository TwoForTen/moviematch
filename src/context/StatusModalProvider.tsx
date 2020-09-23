import React, { createContext, useState } from 'react';

interface StatusModal {
  isOpen: boolean;
  movieId: null | string;
  title: string;
}

interface StatusModalContextType {
  statusModal: StatusModal;
  setStatusModal: React.Dispatch<React.SetStateAction<StatusModal>>;
}

export const StatusModalContext = createContext<StatusModalContextType>({
  statusModal: { isOpen: false, movieId: null, title: '' },
  setStatusModal: () => {},
});

const StatusModalProvider: React.FC = ({ children }) => {
  const [statusModal, setStatusModal] = useState<StatusModal>({
    isOpen: false,
    movieId: null,
    title: '',
  });
  return (
    <StatusModalContext.Provider value={{ statusModal, setStatusModal }}>
      {children}
    </StatusModalContext.Provider>
  );
};

export default StatusModalProvider;
