export const formatCoordinates = (data) => {
    return data.map((item) => ({
        lat: item[2],
        lng: item[3]
    }));
};
