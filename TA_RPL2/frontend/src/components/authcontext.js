import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (storedToken && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setToken(storedToken);
    } else {
      setIsLoggedIn(false);
      setUsername("");
      setToken("");
    }

    const handleWindowUnload = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    };

    window.addEventListener("beforeunload", handleWindowUnload);

    return () => {
      window.removeEventListener("beforeunload", handleWindowUnload);
    };
  }, []);

  const login = (user) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("username", user.username);
    setIsLoggedIn(true);
    setUsername(user.username);
    setToken(user.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setToken("");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, username, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
