export const formatCoordinates = (data) => {
    return data.map((item) => {
        const { lon, ...rest } = item;
        return {
            ...rest,
            lng: lon,
        };
    });
};
