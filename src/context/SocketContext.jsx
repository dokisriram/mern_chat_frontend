import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io as ioClient } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const s = ioClient(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],
      auth: { token },
      withCredentials: true,
    });

    // s.on('connect', () => {
    //   if (user?._id) s.emit('user-join', user._id);
    // });

    s.on('connect_error', (err) => {
      console.error('Socket connect_error:', err.message);
    });

    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, [token, user?._id]);

  const value = useMemo(() => ({ socket }), [socket]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);