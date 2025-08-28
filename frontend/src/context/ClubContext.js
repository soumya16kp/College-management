
import  { createContext, useContext, useState, useEffect } from "react";
import { getClubs, createClub, updateClub, deleteClub } from "../services/clubService";

const ClubContext = createContext();

export const useClubs = () => useContext(ClubContext);

export const ClubProvider = ({ children }) => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const data = await getClubs();
      setClubs(data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    }
  };

  const addClub = async (clubData) => {
    try {
      const newClub = await createClub(clubData);
      setClubs((prev) => [...prev, newClub]);
    } catch (error) {
      console.error("Error creating club:", error);
    }
  };

  const editClub = async (id, clubData) => {
    try {
      const updatedClub = await updateClub(id, clubData);
      setClubs((prev) =>
        prev.map((club) => (club.id === id ? updatedClub : club))
      );
    } catch (error) {
      console.error("Error updating club:", error);
    }
  };

  const removeClub = async (id) => {
    try {
      await deleteClub(id);
      setClubs((prev) => prev.filter((club) => club.id !== id));
    } catch (error) {
      console.error("Error deleting club:", error);
    }
  };

  return (
    <ClubContext.Provider value={{ clubs, fetchClubs, addClub, editClub, removeClub }}>
      {children}
    </ClubContext.Provider>
  );
};
