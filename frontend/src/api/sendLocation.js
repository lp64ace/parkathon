import axios from "axios";

// Send parking location to backend
export const sendLocation = async (userId, location) => {
    try {
        const response = await axios.post(
            "http://94.131.153.207:3000/parking",
            {
                user_id: userId,
                location: location,
                start_time: new Date().toISOString(),
            },
        );

        console.log("Response:", response.data);
    } catch (error) {
        console.error("Error sending parking location:", error);
    }
};
