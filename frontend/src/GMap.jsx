import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
} from "@vis.gl/react-google-maps";
import { useCallback, useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const INITIAL_CAMERA = {
    center: { lat: 40.6401, lng: 22.9444 },
    zoom: 12,
};

function GMap({ currentLocation, cameraLocation, marker }) {
    const [cameraProps, setCameraProps] = useState(INITIAL_CAMERA);
    const handleCameraChange = useCallback((ev) => {
        // console.log(ev);
        setCameraProps(ev.detail);
    }, []);

    const markerLocation = (marker == 'parking') ? currentLocation : cameraLocation;

    useEffect(() => {
        if (!markerLocation) {
            return;
        } else {
            setCameraProps((prev) => ({
                ...prev,
                center: markerLocation,
            }));
        }
    }, [markerLocation]);

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
                {markerLocation && (
                    <AdvancedMarker position={markerLocation}>
                        <Pin
                            background={"#0f9d58"}
                            borderColor={"#006425"}
                            glyphColor={"#60d98f"}
                        />
                    </AdvancedMarker>
                )}
            </Map>
        </APIProvider>
    );
}

export default GMap;
