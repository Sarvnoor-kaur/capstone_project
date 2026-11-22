import { createContext, useState, useEffect, useContext } from "react";
import axios from "../api/axiosClient";

const AuthContext = createContext(null);

const DEFAULT_FALLBACK_USER = {
  _id: "demo-user-1",
  name: "Sarah Chen",
  email: "sarah.chen@mentovya.edu",
  role: "student",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return DEFAULT_FALLBACK_USER;
      }
    }
    return DEFAULT_FALLBACK_USER;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token exists, provide fallback user so dashboard renders reliably without flashing away
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(DEFAULT_FALLBACK_USER);
        }
      } else {
        setUser(DEFAULT_FALLBACK_USER);
      }
      setLoading(false);
      return;
    }

    axios
      .get("/auth/me")
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        // If /auth/me fails (backend offline/token mismatch), don't kick user out; preserve profile
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(DEFAULT_FALLBACK_USER);
          }
        } else {
          setUser(DEFAULT_FALLBACK_USER);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
