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
        <div>
            <div>
                <div>Longitude: {currentPosition?.coords.longitude}</div>
                <div>Latitude: {currentPosition?.coords.latitude}</div>
            </div>

            <div>
                <div className="bg-red-100 p-8 shadow-md rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Restaurant Preferences</h2>
                </div>

                <form>
                    <div>
                        <label>How much are you willing to spend on the meal? </label>
                        <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} />
                    </div>
                    <div>
                        <label>How far are you willing to travel? </label>
                        <input type="text" value={distance} onChange={(e) => setDistance(e.target.value)} />
                    </div>
                    <div>
                        <label>What time do you want to visit the restaurant? </label>
                        <input type="text" value={time} onChange={(e) => setTime(e.target.value)} />
                    </div>
                    <div>
                        <label>Do you have any dietary preferences?</label>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    value="Vegetarian"
                                    checked={dietaryPreferences.includes("Vegetarian")}
                                    onChange={handleDietaryPreferenceChange}
                                />{" "}
                                Vegetarian
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    value="Vegan"
                                    checked={dietaryPreferences.includes("Vegan")}
                                    onChange={handleDietaryPreferenceChange}
                                />{" "}
                                Vegan
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    value="Seafood"
                                    checked={dietaryPreferences.includes("Seafood")}
                                    onChange={handleDietaryPreferenceChange}
                                />{" "}
                                Seafood
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    value="Gluten-free"
                                    checked={dietaryPreferences.includes("Gluten-free")}
                                    onChange={handleDietaryPreferenceChange}
                                />{" "}
                                Gluten-free
                            </label>
                        </div>
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default UserFilter;
