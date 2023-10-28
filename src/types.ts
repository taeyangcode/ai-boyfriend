// Price per Person
// 1: <= $10
// 2: 11-30
// 3: 31-60
// 4: > $61
type PriceLevel = 1 | 2 | 3 | 4;

type FoodCategory = "vegetarian" | "vegan" | "seafood" | "gluten_free";

type UserInput = {
    // position: {
    //     longitude: number;
    //     latitude: number;
    // };
    price: number;
    radius: number;
    date: number; // Unix timestamp
    dietary_preferences: string[];
};
