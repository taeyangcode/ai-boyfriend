import { useEffect, useState } from 'react'
import './../index.css'
import LocationCard from '../LocationCard/LocationCard'

interface Props {
    locationIds: Array<string>
}

function Result({ locationIds }: Props) {
    const [locationData, setLocationData] = useState<Array<YelpBusiness>>([])

    useEffect(() => {
        async function getLocationData(): Promise<Array<YelpBusiness>> {
            const responses: Array<Response> = await Promise.all(
                locationIds.map((locationId) => fetch(`http://127.0.0.1:8000/api/businesses/${locationId}`, { method: 'POST' }))
            )
            const locationJson: Array<unknown> = await Promise.all(responses.map((response) => response.json()))
            return locationJson as Array<YelpBusiness>
        }

        getLocationData().then((result) => setLocationData(result))
    }, [])

    return (
        <div className="flex flex-row justify-evenly rounded-lg bg-gray-100 p-8 shadow-md">
            {locationData.map((data) => (
                <LocationCard businessData={data} />
            ))}
        </div>
    )
}

export default Result
