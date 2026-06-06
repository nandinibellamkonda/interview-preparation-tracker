import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTokenFromStorage = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
  };

  const saveToken = (token, remember) => {
    if (remember) {
      localStorage.setItem("token", token);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", token);
      localStorage.removeItem("token");
    }
  };

  const clearToken = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  const loadProfile = async () => {
    const token = getTokenFromStorage();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getProfile(token);
      setUser({ ...response.user, token });
    } catch (err) {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const login = async (email, password, remember = false) => {
    const response = await authService.login(email, password);
    if (response?.error) {
      throw new Error(response.error || "Login failed.");
    }
    saveToken(response.token, remember);
    setUser({ ...response.user, token: response.token });
    return response;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    if (response?.error) {
      throw new Error(response.error || "Registration failed.");
    }
    saveToken(response.token, true);
    setUser({ ...response.user, token: response.token });
    return response;
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  const updateProfileFields = async (updates) => {
    const token = getTokenFromStorage();
    if (!token) {
      throw new Error("Authentication required.");
    }
    const response = await authService.updateProfile(token, updates);
    if (response?.error) {
      throw new Error(response.error || "Failed to update profile.");
    }
    setUser((prev) => ({ ...prev, ...response.user, token }));
    return response;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, updateProfileFields }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);