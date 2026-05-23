"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "@/lib/api";
import type { User } from "@/types/college";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const persist = (t: string | null, u: User | null) => {
    if (t) localStorage.setItem("cc_token", t);
    else localStorage.removeItem("cc_token");
    setToken(t);
    setUser(u);
  };

  useEffect(() => {
    const t = localStorage.getItem("cc_token");
    if (!t) {
      setLoading(false);
      return;
    }
    setToken(t);
    api
      .get<User>("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => persist(null, null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ user: User; token: string }>(
      "/api/auth/login",
      { email, password }
    );
    persist(data.token, data.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await api.post<{ user: User; token: string }>(
        "/api/auth/register",
        { name, email, password }
      );
      persist(data.token, data.user);
    },
    []
  );

  const logout = useCallback(() => persist(null, null), []);

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
