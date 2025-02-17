import { CarFront, CircleParking, ArrowDown, X, Search } from "lucide-react";
import { occupyPark } from "./api/occupyPark";
import { getParkingLocations } from "./api/getParkingLocations";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";
import { formatCoordinates } from "./utils/formatCoordinates";

function Footer({
    setCurrentLocation,
    userId,
    setCameraLocation,
    setMarker,
    setParkingLocations,
}) {
    const [driveOpen, setDriveOpen] = useState(false);
    const [destinationInput, setDestinationInput] = useState("");
    const [parkIsLoading, setParkIsLoading] = useState(false);

    const handleParkButton = () => {
        try {
            setParkIsLoading(true);
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        setCurrentLocation(location);
                        setMarker("parking");
                        occupyPark(userId, location.lat, location.lng); // Send location to backend
                        setParkIsLoading(false);
                        console.log(location);
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        alert(
                            "Unable to get your location. Please enable location services.",
                        );
                    },
                );
            } else {
                alert("Geolocation is not supported by your browser");
            }
        } catch {
            setParkIsLoading(false);
            console.error("Error getting location");
        }
    };

    const handleDriveClick = () => {
        setDriveOpen(true);
    };

    const handleCancelDriveClick = () => {
        setDriveOpen(false);
    };

    const handleSearchButton = async () => {
        if (destinationInput === "") {
            alert("Please enter a destination");
            return;
        }

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    destinationInput,
                )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
            );

            const data = await response.json();

            if (data.status === "OK") {
                const location = {
                    lat: data.results[0].geometry.location.lat,
                    lng: data.results[0].geometry.location.lng,
                };
                console.log("Found location:", location);
                setCameraLocation(location);

                try {
                    let parkingLocations = await getParkingLocations(
                        location.lat,
                        location.lng,
                        50,
                    );
                    parkingLocations = formatCoordinates(parkingLocations);
                    setParkingLocations(parkingLocations);
                } catch (error) {
                    console.error("Error getting parking locations:", error);
                }

                // Mock data
                // setParkingLocations([
                //     { lat: location.lat + 0.001, lng: location.lng - 0.001 },
                //     { lat: location.lat - 0.001, lng: location.lng + 0.002 },
                //     { lat: location.lat + 0.002, lng: location.lng + 0.001 },
                //     { lat: location.lat - 0.002, lng: location.lng - 0.002 },
                //     { lat: location.lat + 0.001, lng: location.lng + 0.002 }
                // ]);

                setMarker("destination");
            } else {
                console.error("Geocoding failed:", data.status);
                alert("Could not find this location");
            }
        } catch (error) {
            console.error("Error fetching location:", error);
            alert("Error fetching location data");
        }
    };

    return (
        <div className="flex w-screen justify-center">
            <div className="fixed bottom-0 z-10 flex w-screen max-w-192 flex-col items-center">
                <div className="flex h-6 w-24 translate-y-[2px] items-center justify-center rounded-t-2xl border-2 border-b-0 border-slate-700 bg-white">
                    <ArrowDown size={20} color="#2e2e2e" />
                </div>
                <div className="flex h-26 w-full justify-between border-t-2 border-slate-700 bg-white p-4 md:rounded-t-xl md:border-2 md:border-b-0">
                    <div className="relative">
                        {/* Drive Button */}
                        <div
                            className={`absolute transition-all duration-300 ${driveOpen ? "pointer-events-none -translate-x-4 opacity-0" : "pointer-events-auto translate-x-0 opacity-100"}`}
                        >
                            <button
                                className={`flex items-center gap-2 rounded-xl border-2 border-slate-600 p-4 transition-colors ${
                                    parkIsLoading
                                        ? "cursor-not-allowed opacity-50"
                                        : "hover:cursor-pointer hover:bg-sky-100"
                                }`}
                                onClick={handleDriveClick}
                                disabled={parkIsLoading}
                            >
                                <CarFront size={32} color="#2e2e2e" />
                                <h3 className="text-2xl font-medium text-gray-800">
                                    Drive
                                </h3>
                            </button>
                        </div>
                        {/* Destination Input */}
                        <div
                            className={`absolute transition-all duration-300 ${driveOpen ? "pointer-events-auto translate-x-0 opacity-100" : "pointer-events-none invisible translate-x-4 opacity-0"}`}
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    className="rounded-full border-2 border-slate-600 p-2 transition-colors hover:cursor-pointer hover:bg-slate-100"
                                    onClick={handleCancelDriveClick}
                                >
                                    <X size={32} color="#2e2e2e" />
                                </button>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl text-gray-800">
                                        Set Destination:
                                    </h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter destination"
                                            className="w-50 rounded-md border-2 border-slate-600 px-2 py-1"
                                            value={destinationInput}
                                            onChange={(e) =>
                                                setDestinationInput(
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleSearchButton();
                                                }
                                            }}
                                        />
                                        <button
                                            className="rounded-md p-2 transition-colors hover:cursor-pointer hover:bg-slate-100"
                                            onClick={handleSearchButton}
                                        >
                                            <Search color="#2e2e2e" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Park Button */}
                    <div
                        className={`transition-all duration-300 ${driveOpen ? "pointer-events-none invisible translate-x-4 opacity-0" : "translate-x-0 opacity-100"}`}
                    >
                        {parkIsLoading ? (
                            <div className="flex items-center gap-2 rounded-xl border-2 border-slate-600 p-4">
                                <CircularProgress size={24} />
                                <h3 className="text-xl text-gray-800">
                                    Parking
                                </h3>
                            </div>
                        ) : (
                            <button
                                className="flex items-center gap-2 rounded-xl border-2 border-slate-600 p-4 transition-colors hover:cursor-pointer hover:bg-red-100"
                                onClick={handleParkButton}
                            >
                                <CircleParking size={32} color="#2e2e2e" />
                                <h3 className="text-2xl font-medium text-gray-800">
                                    Park
                                </h3>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
