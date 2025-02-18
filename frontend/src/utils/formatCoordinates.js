export const formatCoordinates = (data) => {
    return data.map((item) => ({
        lat: item[2],
        lng: item[3]
    }));
};

export const renameCoordinates = (data) => {
    return data.map((item) => ({
        ...item,
        lng: item.lon,
        lat: item.lat
    }));
}
