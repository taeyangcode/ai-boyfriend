import { useState } from 'react'
import UserFilter from './UserFilter/UserFilter'
import Questionnaire from './Questionnaire/Questionnaire'
import Result from './Result/Result'
import NotificationHandler from './Notification/Notification'

function App() {
    const [notifications, setNotifications] = useState<Array<NotificationType>>(
        []
    )
    const [selectedPage, setSelectedPage] = useState<Page>('result')

    // Questions and choices for questionnaire page
    const [question, setQuestion] = useState<string>('Sample Question')
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
                return <Result locationIds={['chick-fil-a-daly-city-2']} />
            default:
                return (
                    <>
                        <h1>404 Page not found</h1>
                    </>
                )
        }
    }

    return (
        <>
            <NotificationHandler notifications={notifications} />
            {renderPage()}
        </>
    )
}

export default App
