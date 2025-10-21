"use client";

import { createContext, useContext, useEffect, useState } from "react";
// import { AuthService } from '@/services/auth.service' // Comentado temporariamente
import { GoAuthService } from "@/services/go-auth.service"; // Usando o adaptador Go
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Usando o serviço adaptador do Go temporariamente
      if (GoAuthService.isAuthenticated()) {
        const userData = await GoAuthService.getCurrentUser();
        setUser(userData);
      }

      // TODO: Quando o backend estiver completo, voltar para:
      // if (AuthService.isAuthenticated()) {
      //   const userData = await AuthService.getCurrentUser()
      //   setUser(userData)
      // }
    } catch (error) {
      // Handle auth check error silently
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Usando o serviço adaptador do Go temporariamente
      const response = await GoAuthService.login({
        login: email,
        password,
      });

      // TODO: Quando o backend estiver completo, voltar para:
      // const response = await AuthService.login({ email, password })

      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Usando o serviço adaptador do Go temporariamente
      await GoAuthService.logout();

      // TODO: Quando o backend estiver completo, voltar para:
      // await AuthService.logout()

      setUser(null);
    } catch (error) {
      // Handle logout error silently
    }
  };

  const refreshUser = async () => {
    try {
      // Usando o serviço adaptador do Go temporariamente
      const userData = await GoAuthService.getCurrentUser();

      // TODO: Quando o backend estiver completo, voltar para:
      // const userData = await AuthService.getCurrentUser();

      setUser(userData);
    } catch (error) {
      // Handle user data update error silently
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
