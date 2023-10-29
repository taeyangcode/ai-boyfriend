interface Props {
    name: string
    image_url?: string
    url?: string
    review_count?: number
    rating?: string
    price?: string
    location: YelpLocation
    display_phone: string
    distance?: string
    hours: Array<YelpHours>
    photos: Array<string>
}

function LocationCard(props: Props) {
    return (
        <div className="max-w-sm rounded shadow-md">
            <img className="w-full" src={props.image_url} />
        </div>
    )
}

export default LocationCard
