import HAWKER_LOCATIONS from '../data/hawkers_full.json';
import LOCAL_CLOSURES from '../data/closures.json';

export const fetchHawkerData = async () => {
    try {
        const closureRes = await fetch(
            `https://data.gov.sg/api/action/datastore_search?resource_id=d_bda4baa634dd1cc7a6c7cad5f19e2d68&limit=200`
        );

        if (!closureRes.ok) throw new Error("API Limit reached");

        const closureJson = await closureRes.json();
        const apiRecords = closureJson?.result?.records || [];

        const mergedClosures = LOCAL_CLOSURES.map(local => {
            const apiMatch = apiRecords.find(api =>
                api.name?.toLowerCase().trim() === local.name?.toLowerCase().trim()
            );
            return apiMatch ? { ...local, ...apiMatch } : local;
        });

        return {
            hawkers: HAWKER_LOCATIONS.features,
            closures: mergedClosures
        };
    } catch (error) {
        console.error("Falling back to local data:", error);
        return {
            hawkers: HAWKER_LOCATIONS.features,
            closures: LOCAL_CLOSURES
        };
    }
};