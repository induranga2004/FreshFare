import React, { createContext, useContext, useEffect, useState } from 'react';
import { socketService } from '../services/socketService';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const socket = await socketService.ensureConnected();
        
        socket.on('connect', () => {
          setIsConnected(true);
          console.log('Connected to socket server');
        });

        socket.on('disconnect', () => {
          setIsConnected(false);
          console.log('Disconnected from socket server');
        });
      } catch (error) {
        console.error('Failed to initialize socket:', error);
        setIsConnected(false);
      }
    };

    initializeSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const value = {
    isConnected,
    socketService
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 