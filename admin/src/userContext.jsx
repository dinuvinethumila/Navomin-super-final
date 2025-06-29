import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("owner");
    return stored ? JSON.parse(stored) : null;
  });

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("owner", JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("owner");
  };

  useEffect(() => {
    const stored = localStorage.getItem("owner");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
