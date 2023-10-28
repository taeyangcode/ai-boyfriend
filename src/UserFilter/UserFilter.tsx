import { useEffect, useState } from "react";
import "./../index.css";

function UserFilter() {
    const [currentPosition, setCurrentPosition] = useState<GeolocationPosition>();
    const [budget, setBudget] = useState<string>("");
    const [distance, setDistance] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);

    const handleDietaryPreferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setDietaryPreferences([...dietaryPreferences, value]);
        } else {
            setDietaryPreferences(dietaryPreferences.filter((pref) => pref !== value));
        }
    };

    const [radius, setRadius] = useState<number>();

    const [category, setCategory] = useState<FoodCategory>();

    const [priceLevel, setPriceLevel] = useState<PriceLevel>();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => setCurrentPosition(position),
            (error) => console.error(error),
            { timeout: 30000 }
        );
    }, []);

    return (
        <div className="bg-gray-100 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Restaurant Preferences</h2>

            <div className="mb-4">
                <div>Longitude: {currentPosition?.coords.longitude}</div>
                <div>Latitude: {currentPosition?.coords.latitude}</div>
            </div>

            <form>
                <div className="mb-4">
                    <label className="block mb-2">How much are you willing to spend on the meal? </label>
                    <input
                        type="text"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">How far are you willing to travel? </label>
                    <input
                        type="text"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">What time do you want to visit the restaurant? </label>
                    <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="border border-gray-300 px-2 py-1 rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Do you have any dietary preferences?</label>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="Vegetarian"
                                checked={dietaryPreferences.includes("Vegetarian")}
                                onChange={handleDietaryPreferenceChange}
                                className="mr-2"
                            />
                            Vegetarian
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="Vegan"
                                checked={dietaryPreferences.includes("Vegan")}
                                onChange={handleDietaryPreferenceChange}
                                className="mr-2"
                            />
                            Vegan
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="Seafood"
                                checked={dietaryPreferences.includes("Seafood")}
                                onChange={handleDietaryPreferenceChange}
                                className="mr-2"
                            />
                            Seafood
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="Gluten-free"
                                checked={dietaryPreferences.includes("Gluten-free")}
                                onChange={handleDietaryPreferenceChange}
                                className="mr-2"
                            />
                            Gluten-free
                        </label>
                    </div>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default UserFilter;
