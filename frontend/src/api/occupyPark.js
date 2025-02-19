import axios from "axios";

// Send parking location to backend
export const occupyPark = async (userId, lat, lon) => {
    try {
        const response = await axios.post(
            `/api/park/occupy?user=${userId}&lat=${lat}&lon=${lon}`,
        );
        return response.data;
    } catch (error) {
        console.log(error);
		alert(error.data || 'Communication with server failed');
        throw error;
    }
};
