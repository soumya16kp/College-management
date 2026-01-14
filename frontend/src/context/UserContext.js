import { createContext, useContext, useEffect, useState } from "react";
import userService from "../services/userservice";

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await userService.getProfile();
      // 'data' contains { user: {...}, designation: "...", participated_events: [...] }
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{
        profile,
        loading,
        fetchProfile,
        setProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};