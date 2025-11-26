import { createContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // ---------------------------------------------
  // Load user on page refresh (if token exists)
  // ---------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      API.get("/accounts/me/")
        .then((res) => setUser(res.data))
        .catch(() => {
          setUser(null);
          localStorage.removeItem("access_token");
        });
    }
  }, []);

  // ---------------------------------------------
  // LOGIN FUNCTION
  // ---------------------------------------------
  const login = async (username, password) => {
    const tokenResponse = await API.post("/auth/token/", {
      username,
      password,
    });

    // Save access token
    localStorage.setItem("access_token", tokenResponse.data.access);

    // Fetch user data
    const meResponse = await API.get("/accounts/me/");
    setUser(meResponse.data);
  };

  // ---------------------------------------------
  // LOGOUT FUNCTION
  // ---------------------------------------------
  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
