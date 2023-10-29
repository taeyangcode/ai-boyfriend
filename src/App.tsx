import { useState } from 'react'
import UserFilter from './UserFilter/UserFilter'
import Questionnaire from './Questionnaire/Questionnaire'
import Result from './Result/Result'
import NotificationHandler from './Notification/Notification'
import '../src/index.css'

function App() {
    const [notifications, setNotifications] = useState<Array<NotificationType>>([])
    const [selectedPage, setSelectedPage] = useState<Page>('preference')

    // Questions and choices for questionnaire page
    const [question, setQuestion] = useState<string>('Hmmm let me think...')
    const [choices, setChoices] = useState<Array<string>>([])

    // ID for result page
    const [restaurantId, setRestaurantId] = useState<Array<string>>([])

    // function to change pages; passed into all components as props
    const changePage = (newPage: Page) => {
        setSelectedPage(newPage)
    }

    const renderPage = () => {
        switch (selectedPage) {
            case 'preference':
                return (
                    <UserFilter
                        notifications={notifications}
                        setNotifications={setNotifications}
                        changePage={changePage}
                        setQuestion={setQuestion}
                        setChoices={setChoices}
                        setRestaurantId={setRestaurantId}
                    />
                )
            case 'questionnaire':
                return (
                    <Questionnaire
                        changePage={changePage}
                        question={question}
                        setQuestion={setQuestion}
                        choices={choices}
                        setChoices={setChoices}
                    />
                )
            case 'result':
                return <Result locationIds={['chick-fil-a-daly-city-2', 'mcdonalds-san-francisco']} restaurantId={restaurantId} />
            default:
                return (
                    <>
                        <h1>404 Page not found</h1>
                    </>
                )
        }
    }

    return (
        <div className="h-screen bg-gradient-to-br from-blue-900 via-blue-200 to-blue-500 bg-cover bg-center bg-no-repeat p-12">
            <NotificationHandler notifications={notifications} />
            {renderPage()}
        </div>
    )
}

export default App
