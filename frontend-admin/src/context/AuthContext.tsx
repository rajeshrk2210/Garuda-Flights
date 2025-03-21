import { createContext, useState, useEffect, ReactNode } from "react";

// 🔹 Admin Interface
interface Admin {
  email: string;
  role: string;
}

// 🔹 Context Type Interface
interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
}

// 🔹 Create Context
export const AuthContext = createContext<AuthContextType | null>(null);

// 🔹 Auth Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 🔹 Load token & admin from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedAdmin = localStorage.getItem("admin");

    if (storedToken) setToken(storedToken);
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
  }, []);

  // 🔹 Login: Save to state and localStorage
  const login = (token: string, admin: Admin) => {
    localStorage.setItem("token", token);
    localStorage.setItem("admin", JSON.stringify(admin));
    setToken(token);
    setAdmin(admin);
  };

  // 🔹 Logout: Clear everything
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setToken(null);
    setAdmin(null);
    window.location.href = "/login"; // Optional redirect
  };

  return (
    <AuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
