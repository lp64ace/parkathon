import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useCallback, useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const INITIAL_CAMERA = {
    center: { lat: 40.6401, lng: 22.9444 },
    zoom: 12,
};

function GMap({ currentLocation }) {
    const [cameraProps, setCameraProps] = useState(INITIAL_CAMERA);
    const handleCameraChange = useCallback((ev) => {
        // console.log(ev);
        setCameraProps(ev.detail);
    }, []);

    useEffect(() => {
        if (currentLocation) {
            setCameraProps((prev) => ({
                ...prev,
                center: currentLocation,
            }));
        }
    }, [currentLocation]);

    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                {...cameraProps}
                style={{ width: "100vw", height: "100vh" }}
                onCameraChanged={handleCameraChange}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
                mapId="MAP1"
            >
                {currentLocation && (
                    <AdvancedMarker position={currentLocation} />
                )}
            </Map>
        </APIProvider>
    );
}

export default GMap;
