import { useEffect, useState, MouseEvent } from 'react'
import './../index.css'
import { showResult, checkResult, getNextQuestion, appendResponse, sendResponse } from '../Helper/Helper'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addDays } from 'date-fns'

interface Props {
    notifications: Array<NotificationType>
    setNotifications: (value: Array<NotificationType>) => void
    changePage: (newPage: Page, messageChain?: ResponseChain) => void
    setQuestion: (value: string) => void
    setChoices: (value: Array<string>) => void
    setRestaurantId: (value: Array<string>) => void
    setResponseChain?: (value: ResponseChain) => void
}

function UserFilter({ notifications, setNotifications, changePage, setQuestion, setChoices, setRestaurantId, setResponseChain }: Props) {
    const [currentPosition, setCurrentPosition] = useState<GeolocationPosition>()
    const [latitude, setLatitude] = useState<string>('')
    const [longitude, setLongitude] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [budget, setBudget] = useState<number>(36)
    const [distance, setDistance] = useState<string>('1234')
    const [date, setDate] = useState<Date>(new Date())
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])

    const [address, setAddress] = useState<string>('426 27th ave')
    const [city, setCity] = useState<string>('sf')
    const [state, setState] = useState<string>('ca')

    const handleDietaryPreferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target
        if (checked) {
            setDietaryPreferences([...dietaryPreferences, value])
        } else {
            setDietaryPreferences(dietaryPreferences.filter((pref) => pref !== value))
        }
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => setCurrentPosition(position),
            (error) => setNotifications([...notifications, { code: error.code, message: error.message }]),
            { timeout: 30000 }
        )
    }, [])

    async function submitForm(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault() // Prevent page from refreshing

        const input: UserInput = {
            input: {
                longitude: Number(longitude),
                latitude: Number(latitude),
                price: Number(price),
                radius: Number(distance),
                date: parseInt((date.getTime() / 1000).toFixed(0)),
                dietary_preferences: dietaryPreferences,
            },
        }

        // First response to check if there is already a result
        // If have_result is false, we continue to get more questions to ask the user to narrow down the list of restaurants
        console.info(input)
        const initialResponse = await fetch('http://127.0.0.1:8000/api/get_result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        })
        const initialResponseJson = await initialResponse.json()

        // Show results page if result is found; Go through questionnaire if not;
        if (checkResult(initialResponseJson)) {
            showResult(initialResponseJson, setRestaurantId, changePage)
        } else {
            getNextQuestion(initialResponseJson, { setQuestion, setChoices }, setResponseChain!)
            changePage('questionnaire', initialResponseJson)
        }
    }

    async function submitAddress() {
        event?.preventDefault()
        if (!address || !city || !state) {
            alert('Invalid address, city, or state')
            return
        }

        const geographicInfo: GeoInput = {
            address: address,
            city: city,
            state: state,
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/api/geolocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(geographicInfo),
            })

            if (response.ok) {
                const latlong_response = await response.json()
                setLatitude(latlong_response.lat)
                setLongitude(latlong_response.lng)
            } else {
                // Handle errors here, e.g., response.status and response.statusText
                console.error('Error:', response.status, response.statusText)
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error)
        }
    }

    return (
        <div className="rounded-lg bg-gray-100 shadow-md">
            <h2 className="mb-8 flex justify-around py-20 text-6xl font-semibold">Tell me everything baby</h2>
            <div className="flex justify-around">
                {/* left container */}
                <div className="pl-8">
                    <div className="mb-4">
                        <div>Longitude: {longitude} </div>
                        <div>Latitude: {latitude}</div>
                    </div>

                    <form>
                        <div className="mb-4">
                            <label className="mb-4 mb-4 mt-8 block text-2xl">Address Line </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="h-12 w-full rounded border border-gray-300 px-2 py-1"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="mb-4 mt-8 block text-2xl">City </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="h-12 w-full rounded border border-gray-300 px-2 py-1"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="mb-4 mt-8 block text-2xl">State </label>
                            <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="h-12 w-full rounded border border-gray-300 px-2 py-1"
                            />
                        </div>

                        <button type="submit" className="mt-4 rounded bg-blue-500 px-4 py-2 text-white" onClick={submitAddress}>
                            Get Geographic Information
                        </button>
                    </form>
                </div>

                {/* right container */}
                <div className="pb-32 pl-4 pr-8">
                    <form>
                        <div>
                            <div className="mb-4 flex">
                                <label className="text-2xl">How much are you willing to spend on the meal (per person)? </label>
                                <div className="ml-16 text-2xl font-bold text-red-600">${budget}</div>
                            </div>
                            <div className="flex">
                                <span>$5</span>
                                <input
                                    type="range"
                                    min="5"
                                    max="70"
                                    step="5"
                                    value={budget}
                                    onChange={(e) => {
                                        const budgetValue = parseFloat(e.target.value)
                                        let price
                                        if (budgetValue <= 10) {
                                            price = '1'
                                        } else if (budgetValue > 10 && budgetValue <= 30) {
                                            price = '2'
                                        } else if (budgetValue > 30 && budgetValue <= 60) {
                                            price = '3'
                                        } else {
                                            price = '4'
                                        }
                                        setBudget(budgetValue)
                                        setPrice(price)
                                    }}
                                    className="mx-5 w-1/2 rounded border border-gray-300 py-1"
                                />
                                <span>$70</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="mb-4 mt-8 block text-2xl">How far are you willing to travel? </label>
                            <input
                                type="text"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                className="h-12 w-full rounded border border-gray-300 px-4 py-2"
                            />
                        </div>
                        {/* Bottom right container */}
                        <div className="flex">
                            <div className="mb-4">
                                <label className="mb-4 mt-8 block pr-4 text-2xl">What time do you want to visit the restaurant? </label>
                                <DatePicker
                                    selected={date}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    onChange={(date) => setDate(date ?? new Date())}
                                    minDate={new Date()}
                                    maxDate={addDays(new Date(), 365)}
                                    placeholderText="Click to select a date and time"
                                    showTimeSelect
                                    showIcon
                                    fixedHeight
                                    inline
                                />
                            </div>

                            <div className="mb-4">
                                <label className="mb-4 mt-8 block text-2xl">Do you have any dietary preferences?</label>
                                <div className="text-l space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value="Vegetarian"
                                            checked={dietaryPreferences.includes('Vegetarian')}
                                            onChange={handleDietaryPreferenceChange}
                                            className="mr-2"
                                        />
                                        Vegetarian
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value="Vegan"
                                            checked={dietaryPreferences.includes('Vegan')}
                                            onChange={handleDietaryPreferenceChange}
                                            className="mr-2"
                                        />
                                        Vegan
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value="Seafood"
                                            checked={dietaryPreferences.includes('Seafood')}
                                            onChange={handleDietaryPreferenceChange}
                                            className="mr-2"
                                        />
                                        Seafood
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            value="Gluten-free"
                                            checked={dietaryPreferences.includes('Gluten-free')}
                                            onChange={handleDietaryPreferenceChange}
                                            className="mr-2"
                                        />
                                        Gluten-free
                                    </label>
                                </div>
                                <button type="submit" className="mt-8 rounded bg-blue-500 px-4 py-2 text-white" onClick={submitForm}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserFilter
