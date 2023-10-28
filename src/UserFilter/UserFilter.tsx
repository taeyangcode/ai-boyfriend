import { useEffect, useState } from "react";

function UserFilter() {
    const [currentPosition, setCurrentPosition] = useState<GeolocationPosition>();

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

    return <div></div>;
}

export default UserFilter;
