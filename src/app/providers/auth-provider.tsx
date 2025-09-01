// app/providers/auth-provider.tsx
'use client'

import React, { useEffect, useState, useContext, createContext, useCallback } from 'react';
import { registerUser, loginUser, RegisterPayload, LoginPayload, RegisterResponse, LoginResponse } from '../api/services/authService';
import { getToken, setToken } from '../api/services/http';


type User = {
  userId: string;
  coupleId: string;
  email: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tente de récupérer le token et infos utilisateur au chargement
    const token = getToken();
    if (token) {
      // Décoder le token pour récupérer userId, coupleId, email (si JWT standard)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({
          userId: payload.userId,
          coupleId: payload.coupleId,
          email: payload.email,
          token,
        });
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await registerUser(payload);
    // L'utilisateur doit ensuite se connecter
    return res;
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginUser(payload);
    setUser({
      userId: res.userId,
      coupleId: res.coupleId,
      email: res.email,
      token: res.access_token,
    });
    return res;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken('');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
