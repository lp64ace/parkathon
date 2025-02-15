import GMap from "./GMap";
import Footer from "./Footer";
import Options from "./Options";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

function App() {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Check if user ID exists in local storage
        let storedUserId = localStorage.getItem("user_id");

        // If no ID exists, create new one
        if (!storedUserId) {
            storedUserId = uuidv4();
            localStorage.setItem("user_id", storedUserId);
        }

        setUserId(storedUserId);
    }, []);

    return (
        <main className="relative h-screen">
            <Options />
            <GMap currentLocation={currentLocation} />
            <Footer setCurrentLocation={setCurrentLocation} userId={userId} />
        </main>
    );
}

export default App;
