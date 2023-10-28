import { useEffect, useState } from 'react'
import './../index.css'

interface Props {
    notifications: Array<NotificationType>
    setNotifications: (value: Array<NotificationType>) => void
    changePage: (newPage: Page) => void
}

function UserFilter({ notifications, setNotifications }: Props) {
    const [currentPosition, setCurrentPosition] =
        useState<GeolocationPosition>()
    const [budget, setBudget] = useState<string>('')
    const [distance, setDistance] = useState<string>('')
    const [time, setTime] = useState<string>('')
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])

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

    async function submitForm() {
        const input: UserInput = {
            longitude: Number(currentPosition?.coords.longitude),
            latitude: Number(currentPosition?.coords.latitude),
            price: Number(budget),
            radius: Number(distance),
            date: Number(time),
            dietary_preferences: dietaryPreferences,
        }
        event?.preventDefault()
        const response = await fetch('http://127.0.0.1:8000/api/businesses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(input),
        }).then((response) => console.log(response.json()))
        console.log(response)
    }

    return (
        <div className="rounded-lg bg-gray-100 p-8 shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">
                Restaurant Preferences
            </h2>

            <div className="mb-4">
                <div>Longitude: {currentPosition?.coords.longitude}</div>
                <div>Latitude: {currentPosition?.coords.latitude}</div>
            </div>

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
