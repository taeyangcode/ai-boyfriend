// Price per Person
// 1: <= $10
// 2: 11-30
// 3: 31-60
// 4: > $61
type PriceLevel = 1 | 2 | 3 | 4

type FoodCategory = 'vegetarian' | 'vegan' | 'seafood' | 'gluten_free'

type UserInput = {
    longitude: number
    latitude: number
    price: number
    radius: number
    date: number // Unix timestamp
    dietary_preferences: string[]
}

type NotificationType = ErrorDetails

interface ErrorDetails {
    code: number
    message: string
}

interface YelpCategory {
    alias: string
    // Alias of a category, when searching for business in certain categories, use alias rather than the title.

    title: string
    // Title of a category for display purpose.
}

interface YelpLocation {
    address1?: string

    address2?: string

    address3?: string

    city?: string

    zip_code?: string

    country?: string

    state?: string

    display_address: string

    cross_streets?: string | null
}

interface YelpHours {
    hour_type: string

    open: {
        day: number

        start: string

        end: string

        is_overnight: string
    }

    is_open_now: boolean
}

interface YelpCoordinates {
    latitude: string
    // Latitude position on map.

    longitude: string
    // Longitude position on map.
}

interface YelpBusiness {
    id: string
    // Yelp Encrypted Business ID.

    alias: string
    // Unique Yelp alias of this business. Can contain unicode characters. Example: 'yelp-san-francisco'.

    name: string
    // Name of this business.

    image_url?: string
    // URL of photo for this business

    is_closed?: boolean
    // Whether business has been (permanently) closed

    url?: string
    // URL for business page on Yelp.

    review_count?: number
    // Number of reviews for this business.

    categories?: Array<YelpCategory>
    // List of category title and alias pairs associated with this business.

    rating?: string
    // Rating for this business (value ranges from 1, 1.5, ... 4.5, 5).

    coordinates: YelpCoordinates
    // Coordinates of this business.

    transactions?: Array<string>
    // List of Yelp transactions that the business is registered for. Current supported values are pickup, delivery and restaurant_reservation.

    price?: string
    // Price level of the business. Value is one of $, $$, $$$ and $$$$.

    phone: string

    display_phone: string

    distance?: string

    hours: Array<YelpHours>

    attributes?: Record<string, any>
}

interface YelpResponse {
    businesses: Array<YelpBusiness>

    total: number

    region: {
        center: YelpLocation
    }
}
