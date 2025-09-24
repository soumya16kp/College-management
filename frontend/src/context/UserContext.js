import { createContext, useContext, useEffect, useState } from "react";
import userService from "../services/userservice";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profile = await userService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to load profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};
