import { useState, useCallback } from "react";
import { locationApi } from "@/lib/api";
import type { Location } from "@/types";

export const useLocationSearch = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchLocations = useCallback(async (query: string) => {
        if (!query.trim()) {
            setLocations([]);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const response = await locationApi.searchLocations(query);
            if (response.content) {
                setLocations(response.content);
            }
        } catch (err) {
            setError("Failed to search locations");
            console.error("Error searching locations:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getAllLocations = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await locationApi.getAllLocations();
            if (response.content) {
                setLocations(response.content);
            }
        } catch (err) {
            setError("Failed to fetch locations");
            console.error("Error fetching locations:", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        locations,
        isLoading,
        error,
        searchLocations,
        getAllLocations,
    };
};
