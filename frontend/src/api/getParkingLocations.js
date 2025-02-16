import axios from "axios";

export const getParkingLocations = async (userId, location) => {
    try {
        const response = await axios.post(
            "http://94.131.153.207:3000/findSpots",
            {
                user_id: userId,
                location: location,
            },
        );
        return response.data;
    } catch (error) {
        console.error("Error getting parking locations:", error);
    }
};
