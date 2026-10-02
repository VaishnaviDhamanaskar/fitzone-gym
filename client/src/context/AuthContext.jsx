import { createContext, useContext, useEffect, useState } from 'react';
import api, { request } from '../services/api.js';

const defaultAuthState = {
  user: null,
  loading: false,
  login: async () => undefined,
  register: async () => undefined,
  logout: () => undefined,
};

const AuthContext = createContext(defaultAuthState);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('fitzone-token')));
  useEffect(() => {
    if (!loading) return;
    request(api.get('/auth/me')).then(({ data }) => setUser(data)).catch(() => {
      localStorage.removeItem('fitzone-token');
    }).finally(() => setLoading(false));
  }, []);
  async function login(credentials) {
    const { data, token } = await request(api.post('/auth/login', credentials));
    localStorage.setItem('fitzone-token', token);
    setUser(data);
    return data;
  }
  async function register(details) {
    const { data, token } = await request(api.post('/auth/register', details));
    localStorage.setItem('fitzone-token', token);
    setUser(data);
    return data;
  }
  function logout() {
    localStorage.removeItem('fitzone-token');
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext) ?? defaultAuthState;
