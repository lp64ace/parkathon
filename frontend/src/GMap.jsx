import { APIProvider, Map } from "@vis.gl/react-google-maps";

function GMap() {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                style={{ width: "100vw", height: "100vh" }}
                defaultCenter={{ lat: 40.6401, lng: 22.9444 }}
                defaultZoom={13}
                gestureHandling={"greedy"}
                disableDefaultUI={true}
            />
        </APIProvider>
    );
}

export default GMap;
