import { createContext, useContext, useMemo, useState } from "react";

import api from "../utils/api";
import { clearAuth, getAuth, saveAuth } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { token: initialToken, user: initialUser } = getAuth();
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);

  const login = async (email, password) => {
    console.log(import.meta.env.VITE_API_URL)
    const { data } = await api.post('/user/login', { email, password });
    saveAuth(data);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/user/signup', { name, email, password });
    saveAuth(data);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    clearAuth();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);