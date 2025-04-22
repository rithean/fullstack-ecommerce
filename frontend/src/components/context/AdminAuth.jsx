import { createContext, useState } from "react";

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo")) || null;
  const [user, setUser] = useState(adminInfo);

  const login = (user) => {
    localStorage.setItem("adminInfo", JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("adminInfo");
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
