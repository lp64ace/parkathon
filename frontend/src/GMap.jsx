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
    zoom: 13,
};

function GMap({ currentLocation, cameraLocation, marker, parkingLocations }) {
    const [cameraProps, setCameraProps] = useState(INITIAL_CAMERA);
    const handleCameraChange = useCallback((ev) => {
        // console.log(ev);
        setCameraProps(ev.detail);
    }, []);

    const markerLocation =
        marker == "parking" ? currentLocation : cameraLocation;

    useEffect(() => {
        if (!markerLocation) {
            return;
        } else {
            setCameraProps((prev) => ({
                ...prev,
                zoom: 17,
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
                        // background={"#0f9d58"}
                        // borderColor={"#006425"}
                        // glyphColor={"#60d98f"}
                        />
                    </AdvancedMarker>
                )}

                {marker === "destination" &&
                    parkingLocations.map((location, index) => {
                        return (
                            <AdvancedMarker key={index} position={location}>
                                <Pin
                                    background={"#0f9d58"}
                                    borderColor={"#006425"}
                                    glyphColor={"#60d98f"}
                                    scale={1.2}
                                />
                            </AdvancedMarker>
                        );
                    })}
            </Map>
        </APIProvider>
    );
}

export default GMap;
