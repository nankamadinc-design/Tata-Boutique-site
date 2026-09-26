import { createContext, useContext, useState, type ReactNode } from 'react';
import { adminLogin, adminLogout } from '../services/api';
import { getAdminToken, setAdminToken, clearAdminToken } from '../services/authStorage';

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue>({
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getAdminToken());

  const login = async (email: string, password: string) => {
    const { token } = await adminLogin(email, password);
    setAdminToken(token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch {
      /* best-effort server-side session invalidation */
    }
    clearAdminToken();
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
