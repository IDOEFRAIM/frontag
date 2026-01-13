'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { registerUser, loginUser } from '@/services/auth.service'; 
import type { Role } from '@prisma/client';

interface AuthContextType {
  user: any;
  userRole: Role | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (data: { email: string; password: string; role: Role; name: string; adminSecret?: string }) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true); 
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<Role | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    const checkSession = () => {
      const savedRole = Cookies.get('user-role') as Role | undefined;
      const savedId = Cookies.get('user-id');
      const savedName = Cookies.get('user-name');

      if (savedRole && savedId) {
        setUserRole(savedRole);
        setUser({ id: savedId, name: savedName, role: savedRole });
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setIsActionLoading(true);
    setError(null);
    try {
      const result = await loginUser({ email, password });
      if (result.success && result.user) {
        setUser(result.user);
        setUserRole(result.user.role);
        // On stocke l'ID et le Rôle
        Cookies.set('user-role', result.user.role, { expires: 7 });
        Cookies.set('user-id', result.user.id, { expires: 7 });
        Cookies.set('user-name', result.user.name || '', { expires: 7 });
        
        return result;
      } else {
        setError(result.error || "Identifiants incorrects");
        return result;
      }
    } catch (err) { 
      setError("Erreur de connexion"); 
      return { success: false, error: "Erreur de connexion" };
    } 
    finally { setIsActionLoading(false); }
  };

  const logout = () => {
    Cookies.remove('user-role');
    Cookies.remove('user-id');
    Cookies.remove('user-name');
    setUser(null);
    setUserRole(undefined);
    router.push('/login');
  };

  const register = async (data: { email: string; password: string; role: Role; name: string; adminSecret?: string }) => {
    setIsActionLoading(true);
    setError(null);
    try {
      const result = await registerUser(data);
      if (result.success && result.user) {
        // Auto-login after registration
        setUser(result.user);
        setUserRole(result.user.role);
        Cookies.set('user-role', result.user.role, { expires: 7 });
        Cookies.set('user-id', result.user.id, { expires: 7 });
        Cookies.set('user-name', result.user.name || '', { expires: 7 });
        
        // Redirection handled by the component or here
        // The user asked to redirect after registering succeed.
        // We can do it here or let the component handle it.
        // Let's return the result so the component can show the success message and redirect.
        return result; 
      } else {
        setError(result.error || "Erreur lors de l'inscription");
        return result;
      }
    } catch (err) { 
      setError("Erreur technique lors de l'inscription"); 
      return { success: false, error: "Erreur technique" };
    } 
    finally { setIsActionLoading(false); }
  };

  return (
    <AuthContext.Provider value={{ 
      user, userRole, isAuthenticated: !!userRole, 
      isLoading, isActionLoading, error, login, register, logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};