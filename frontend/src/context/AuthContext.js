
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/me', { withCredentials: true });
      setUser(res.data.user);
    } catch { setUser(null); } finally { setLoading(false); }
  };
  useEffect(() => { checkAuth(); }, []);
  const logout = async () => { await axios.post('/api/auth/logout'); setUser(null); };
  return <AuthContext.Provider value={{ user, setUser, loading, checkAuth, logout }}>{children}</AuthContext.Provider>;
}
