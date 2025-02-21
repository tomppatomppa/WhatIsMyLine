import * as React from "react";
import { getCookie, removeCookie } from "./utils/helpers";

export interface AuthContext {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!getCookie("csrf_access_token")) // !!user;

  const logout = React.useCallback(() => {
    removeCookie("access_token_cookie");
    removeCookie("csrf_access_token");
    removeCookie("refresh_token_cookie");
    removeCookie("csrf_refresh_token");
    setIsAuthenticated(false)
  }, []);

  const login = React.useCallback(() => {
    setIsAuthenticated(!!getCookie("csrf_access_token"))
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
