
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { getClubs, createClub, updateClub, deleteClub } from "../services/clubService";
import authService from "../services/authService";

const ClubContext = createContext();

export const useClubs = () => useContext(ClubContext);

export const ClubProvider = ({ children }) => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { status } = useSelector((state) => state.auth);
  const [clubGalleries, setClubGalleries] = useState({}); // Cache for galleries: { clubId: [galleryItems] }


  useEffect(() => {
    fetchClubs();
  }, [status]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const data = await getClubs();
      setClubs(data);
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
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

  // Gallery Fetching with Caching
  const fetchClubGallery = useCallback(async (clubId, forceRefresh = false) => {
    if (!forceRefresh && clubGalleries[clubId]) {
      //  console.log(`Using cached gallery for club ${clubId}`);
      return;
    }

    try {
      const res = await authService.apiClient.get(`/gallery/club/${clubId}/`);
      setClubGalleries(prev => ({
        ...prev,
        [clubId]: res.data
      }));
      return res.data;
    } catch (err) {
      console.error("Error fetching galleries:", err);
    }
  }, [clubGalleries]);

  return (
    <ClubContext.Provider value={{
      clubs,
      loading,
      fetchClubs,
      addClub,
      editClub,
      removeClub,
      clubGalleries,
      fetchClubGallery
    }}>
      {children}
    </ClubContext.Provider>
  );
};
