import * as React from "react";
import { User } from "./store/userStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuth } from "./API/authApi";
import { clearCookiesAndLogout, removeCookie } from "./utils/helpers";
import {
  redirect,
  useNavigate,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { Route } from "./routes/login";

export interface AuthContext {
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  user: User | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

const key = "tanstack.auth.user";

function getStoredUser() {
  const item = localStorage.getItem(key);
  if (item) return JSON.parse(item);
  return null;
}

function setStoredUser(user: User | null) {
  if (user) {
    localStorage.setItem(key, JSON.stringify(user));
  } else {
    localStorage.removeItem(key);
  }
}
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(getStoredUser());
  const isAuthenticated = !!user;

  const logout = React.useCallback(() => {
    removeCookie("access_token_cookie");
    removeCookie("csrf_access_token");

    setStoredUser(null);
    setUser(null);
  }, []);

  const login = React.useCallback((user: User) => {
    setStoredUser(user);
    setUser(user);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
