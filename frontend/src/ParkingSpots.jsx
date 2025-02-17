import { CircleParkingOff, X, ChevronUp } from "lucide-react";
import { useState } from "react";
import { getActiveParkingSpots } from "./api/getActiveParkingSpots";
import { vacateParkingSpot } from "./api/vacateParkingSpot";
import CircularProgress from "@mui/material/CircularProgress";

function ParkingSpots({ userId }) {
    const [activeParkingSpotsOpen, setActiveParkingSpotsOpen] = useState(false);
    const [activeParkingSpots, setActiveParkingSpots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleParkingSpotsButton = async () => {
        try {
            setIsLoading(true);
            setActiveParkingSpotsOpen(true);
            // const spots = await getActiveParkingSpots(userId);
            // setActiveParkingSpots(spots);

            //Mock data
            const spots = [
                { lat: 37.9838, lng: 23.7275, parking_id: "p1" },
                { lat: 37.9848, lng: 23.7285, parking_id: "p2" },
                { lat: 37.9858, lng: 23.7295, parking_id: "p3" },
            ];
            const spotsWithNames = await Promise.all(
                spots.map(async (spot) => {
                    const streetName = await getStreetName(spot.lat, spot.lng);
                    return { ...spot, name: streetName };
                }),
            );
            setActiveParkingSpots(spotsWithNames);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error getting active parking spots:", error);
        }
    };

    const handleCollapseParkingSpotsButton = () => {
        setActiveParkingSpotsOpen(false);
    };

    const handleDeleteParkingSpot = async (parkingId) => {
        try {
            await vacateParkingSpot(userId, parkingId);
            setActiveParkingSpots((prevSpots) =>
                prevSpots.filter((spot) => spot.parking_id !== parkingId),
            );
        } catch (error) {
            console.error("Error deleting parking spot:", error);
        }
    };

    const getStreetName = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
                const addressComponents = data.results[0].address_components;
                const streetName =
                    addressComponents.find((component) =>
                        component.types.includes("route"),
                    )?.long_name || "Unknown Street";
                return streetName;
            }
            return "Unknown Location";
        } catch (error) {
            console.error("Error getting street name:", error);
        }
    };

    return (
        <>
            {!activeParkingSpotsOpen ? (
                <button
                    className="fixed top-4 right-4 z-10 rounded-full border-2 border-slate-600 bg-white p-2 shadow-sm shadow-slate-500 transition-colors hover:cursor-pointer hover:bg-slate-100"
                    onClick={handleParkingSpotsButton}
                >
                    <CircleParkingOff size={32} color="#c95353" />
                </button>
            ) : (
                <div className="fixed top-4 right-4 z-10 flex flex-col gap-4 rounded-xl border-2 border-slate-600 bg-white p-4 shadow-sm shadow-slate-500">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <CircularProgress size={32} />
                            <h3 className="">Loading</h3>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between gap-6">
                                <h2 className="text-lg font-bold">
                                    Active Parking Spots
                                </h2>
                                <button
                                    className="self-end rounded-full border-2 border-slate-600 p-1 transition-colors hover:cursor-pointer hover:bg-slate-100"
                                    onClick={handleCollapseParkingSpotsButton}
                                >
                                    <ChevronUp size={24} color="#2e2e2e" />
                                </button>
                            </div>
                            <hr className="h-px w-full bg-slate-300" />
                            <div className="flex flex-col gap-2">
                                {activeParkingSpots.map((spot, index) => (
                                    <div
                                        key={spot.parking_id}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <h3 className="text-lg text-gray-800">
                                            {`${index + 1}. ${spot.name}`}
                                        </h3>
                                        <button
                                            className="rounded-full border-2 border-slate-600 p-1 transition-colors hover:cursor-pointer hover:bg-slate-100"
                                            onClick={() =>
                                                handleDeleteParkingSpot(
                                                    spot.parking_id,
                                                )
                                            }
                                        >
                                            <X size={24} color="#c95353" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default ParkingSpots;
