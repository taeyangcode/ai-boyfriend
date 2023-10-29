import { useEffect, useState } from 'react'
import './../index.css'

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
        <div className="rounded-lg bg-gray-100 p-8 shadow-md">
            {locationData.map((data) => (
                <>
                    <h2 className="mb-4 text-2xl font-semibold">{data.name}</h2>
                    <p>{data.image_url}</p>
                </>
            ))}
        </div>
    )
}

export default Result
