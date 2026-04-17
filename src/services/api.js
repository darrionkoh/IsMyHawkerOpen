import HAWKER_LOCATIONS from '../data/hawkers_full.json';
import LOCAL_CLOSURES from '../data/closures.json';

export const fetchHawkerData = async () => {
    try {
        const closureRes = await fetch(
            `https://data.gov.sg/api/action/datastore_search?resource_id=d_bda4baa634dd1cc7a6c7cad5f19e2d68`
        );

        //if api down
        if (!closureRes.ok) {
            console.warn("API busy, falling back to local data");
            return {
                hawkers: HAWKER_LOCATIONS.features,
                closures: LOCAL_CLOSURES //use local
            };
        }

        const closureJson = await closureRes.json();

        return {
            hawkers: HAWKER_LOCATIONS.features,
            closures: closureJson?.result?.records || LOCAL_CLOSURES
        };
    } catch (error) {
        console.error("Hybrid Fetch Error:", error);

        return {
            hawkers: HAWKER_LOCATIONS.features,
            closures: LOCAL_CLOSURES
        };
    }
};