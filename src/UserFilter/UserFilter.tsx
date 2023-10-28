import { useEffect, useState } from "react";

function UserFilter() {
    const [currentPosition, setCurrentPosition] = useState<GeolocationPosition>();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => setCurrentPosition(position));
    }, []);

    return (
        <div>
            <div>Longitude: {currentPosition?.coords.longitude}</div>
            <div>Latitude: {currentPosition?.coords.latitude}</div>
        </div>
    );
}

export default UserFilter;
