import { useEffect, useState, MouseEvent } from 'react'
import './../index.css'

interface Props {
    notifications: Array<NotificationType>
    setNotifications: (value: Array<NotificationType>) => void
    changePage: (newPage: Page) => void
    setQuestion: (value: string) => void
    setChoices: (value: Array<string>) => void
    setRestaurantId: (value: Array<string>) => void
}

function UserFilter({
    notifications,
    setNotifications,
    changePage,
    setQuestion,
    setChoices,
    setRestaurantId,
}: Props) {
    const [currentPosition, setCurrentPosition] =
        useState<GeolocationPosition>()

    const [latitude, setLatitude] = useState<string>('')
    const [longitude, setLongitude] = useState<string>('')
    const [budget, setBudget] = useState<string>('')
    const [distance, setDistance] = useState<string>('')
    const [time, setTime] = useState<string>('')
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])

    const [address, setAddress] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const [state, setState] = useState<string>('')

    const handleDietaryPreferenceChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value, checked } = event.target
        if (checked) {
            setDietaryPreferences([...dietaryPreferences, value])
        } else {
            setDietaryPreferences(
                dietaryPreferences.filter((pref) => pref !== value)
            )
        }
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => setCurrentPosition(position),
            (error) =>
                setNotifications([
                    ...notifications,
                    { code: error.code, message: error.message },
                ]),
            { timeout: 30000 }
        )
    }, [])

    async function submitForm(event: MouseEvent<HTMLButtonElement>) {
        const input: UserInput = {
            longitude: Number(currentPosition?.coords.longitude),
            latitude: Number(currentPosition?.coords.latitude),
            price: Number(budget),
            radius: Number(distance),
            date: Number(time),
            dietary_preferences: dietaryPreferences,
        }
        event.preventDefault()
        const response = await fetch('http://127.0.0.1:8000/api/get_result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        })
        const json = await response.json()
        console.log(json)
        console.log('separator')
        console.log(json['messages'])
        console.log(typeof json['messages'])

        // Show results page if result is found; Go through questionnaire if not;
        const haveResult =
            json['latest_response']['function_call']['arguments']['have_result']

        if (haveResult) {
            // send restaurant id to get_result endpoint
            const restaurantId = [
                json['latest_response']['function_call']['arguments']['result'],
            ]
            setRestaurantId(restaurantId)
            changePage('result')
        } else {
            // Get questions and choices from diff endpoint
            const response2 = await fetch(
                'http://127.0.0.1:8000/api/get_question',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: json['messages'],
                    }),
                }
            )
            const json2 = await response2.json()
            console.log(json2)

            // Store response of question and choice
            const json3 = JSON.parse(
                json2['latest_response']['function_call']['arguments']
            )
            const questionAndChoices = json3['question']
            setQuestion(questionAndChoices['question'])
            setChoices(questionAndChoices['choices'])

            console.log('question: ', questionAndChoices['question'])
            console.log('choices: ', questionAndChoices['choices'])

            // Change page
            changePage('questionnaire')
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
            const response = await fetch(
                'http://127.0.0.1:8000/api/geolocation',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(geographicInfo),
                }
            )

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
        <div className="rounded-lg bg-gray-100 p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">
                Restaurant Preferences
            </h2>

            <div className="mb-4">
                <div>Longitude: {longitude} </div>
                <div>Latitude: {latitude}</div>
            </div>

            <form>
                <div className="mb-4">
                    <label className="mb-2 block">Address Line </label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1"
                    />
                </div>

                <div className="mb-4">
                    <label className="mb-2 block">City </label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1"
                    />
                </div>

                <div className="mb-4">
                    <label className="mb-2 block">State </label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 text-white"
                    onClick={submitAddress}
                >
                    Get Geographic Information
                </button>
            </form>

            <form>
                <div className="mb-4">
                    <label className="mb-2 block">
                        How much are you willing to spend on the meal?{' '}
                    </label>
                    <input
                        type="text"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block">
                        How far are you willing to travel?{' '}
                    </label>
                    <input
                        type="text"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block">
                        What time do you want to visit the restaurant?{' '}
                    </label>
                    <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1"
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block">
                        Do you have any dietary preferences?
                    </label>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                value="Vegetarian"
                                checked={dietaryPreferences.includes(
                                    'Vegetarian'
                                )}
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
                                checked={dietaryPreferences.includes(
                                    'Gluten-free'
                                )}
                                onChange={handleDietaryPreferenceChange}
                                className="mr-2"
                            />
                            Gluten-free
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="rounded bg-blue-500 px-4 py-2 text-white"
                    onClick={submitForm}
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default UserFilter
