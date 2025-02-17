import { CarFront, CircleParking, ArrowDown, X, Search } from "lucide-react";
import { occupyPark } from "./api/occupyPark";
import { getParkingLocations } from "./api/getParkingLocations";
import { useState, useEffect } from "react";

function Footer({ setCurrentLocation, userId, setCameraLocation, setMarker, setParkingLocations }) {
    const [driveOpen, setDriveOpen] = useState(false);
    const [destinationInput, setDestinationInput] = useState("");

    const handleParkClick = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCurrentLocation(location);
                    setMarker('parking');
                    occupyPark(userId, location.lat, location.lng); // Send location to backend
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
    };

    const handleDriveClick = () => {
        setDriveOpen(true);
    };

    const handleCancelDriveClick = () => {
        setDriveOpen(false);
    };

    const handleSearchButton = () => {
        if (destinationInput === "") {
            alert("Please enter a destination");
            return;
        }

        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ address: destinationInput }, (results, status) => {
            if (status === "OK") {
                const location = {
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                };
                console.log("Found location:", location);
                setCameraLocation(location);
                setParkingLocations(getParkingLocations(location.lat, location.lng, 50));

                // Mock data
                // setParkingLocations([
                //     { lat: location.lat + 0.001, lng: location.lng - 0.001 },
                //     { lat: location.lat - 0.001, lng: location.lng + 0.002 },
                //     { lat: location.lat + 0.002, lng: location.lng + 0.001 },
                //     { lat: location.lat - 0.002, lng: location.lng - 0.002 },
                //     { lat: location.lat + 0.001, lng: location.lng + 0.002 }
                // ]);

                setMarker('destination');
            } else {
                console.error("Geocoding failed:", status);
                alert("Could not find this location");
            }
        });
    };

    return (
        <div className="fixed bottom-0 z-10 flex w-screen flex-col items-center">
            <div className="flex h-6 w-24 translate-y-[2px] items-center justify-center rounded-t-2xl border-2 border-b-0 border-slate-700 bg-white">
                <ArrowDown size={20} color="#2e2e2e" />
            </div>
            <div className="flex h-26 w-screen justify-between border-t-2 border-slate-700 bg-white p-4">
                <div className="relative">
                    {/* Drive Button */}
                    <div
                        className={`absolute transition-all duration-300 ${driveOpen ? "pointer-events-none -translate-x-4 opacity-0" : "pointer-events-auto translate-x-0 opacity-100"}`}
                    >
                        <button
                            className="flex items-center gap-2 rounded-xl border-2 border-slate-600 p-4 transition-colors hover:cursor-pointer hover:bg-sky-100"
                            onClick={handleDriveClick}
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
                                            setDestinationInput(e.target.value)
                                        }
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
                    <button
                        className="flex items-center gap-2 rounded-xl border-2 border-slate-600 p-4 transition-colors hover:cursor-pointer hover:bg-red-100"
                        onClick={handleParkClick}
                    >
                        <CircleParking size={32} color="#2e2e2e" />
                        <h3 className="text-2xl font-medium text-gray-800">
                            Park
                        </h3>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Footer;
