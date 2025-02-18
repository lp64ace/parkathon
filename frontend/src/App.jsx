import GMap from "./GMap";
import Footer from "./Footer";
import Options from "./Options";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ParkingSpots from "./ParkingSpots";

function App() {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [cameraLocation, setCameraLocation] = useState(null);
    const [marker, setMarker] = useState(null);
    const [userId, setUserId] = useState(null);
    const [parkingLocations, setParkingLocations] = useState([]);

    return (
        <main className="relative h-screen">
            <Options />
            <ParkingSpots userId={userId} />
            <GMap
                currentLocation={currentLocation}
                cameraLocation={cameraLocation}
                marker={marker}
                parkingLocations={parkingLocations}
            />
            <Footer
                setCurrentLocation={setCurrentLocation}
                userId={userId}
                setCameraLocation={setCameraLocation}
                setMarker={setMarker}
                setParkingLocations={setParkingLocations}
                setUserId={setUserId}
            />
        </main>
    );
}

export default App;
