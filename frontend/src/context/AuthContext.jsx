import React, { createContext, useContext, useState, useEffect } from "react";
import { loginApi, registerApi, getMeApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await getMeApi();
          if (res.success && res.data) {
            setUser(res.data);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (err) {
          console.warn("Auto-login session validation skipped/failed:", err.message);
          // Only clear if 401
          if (err.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res.success && res.data) {
      const { token: newToken, ...userData } = res.data;
      // Include token inside stored user object as well for dual compatibility
      const fullUserData = { ...userData, token: newToken };
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(fullUserData));
      setToken(newToken);
      setUser(fullUserData);
      return res;
    }
    throw new Error(res.message || "Login failed");
  };

  const register = async (name, email, password) => {
    const res = await registerApi({ name, email, password });
    if (res.success && res.data) {
      const { token: newToken, ...userData } = res.data;
      const fullUserData = { ...userData, token: newToken };
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(fullUserData));
      setToken(newToken);
      setUser(fullUserData);
      return res;
    }
    throw new Error(res.message || "Registration failed");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
