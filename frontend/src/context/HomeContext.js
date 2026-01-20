import { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";

const HomeContext = createContext();

export const useHome = () => useContext(HomeContext);

export const HomeProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch data, can be called manually to refresh
    const fetchHomeData = useCallback(async (force = false) => {
        // If we already have data and not forcing refresh, don't fetch
        if (data && !force) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await authService.apiClient.get("/clubs/home-data/");
            setData(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch home data", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [data]);

    // Initial fetch on mount
    useEffect(() => {
        fetchHomeData();
    }, [fetchHomeData]);

    return (
        <HomeContext.Provider value={{ data, loading, error, fetchHomeData }}>
            {children}
        </HomeContext.Provider>
    );
};
