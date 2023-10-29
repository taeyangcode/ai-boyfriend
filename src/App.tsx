import { useState } from 'react'
import UserFilter from './UserFilter/UserFilter'
import Questionnaire from './Questionnaire/Questionnaire'
import Result from './Result/Result'
import NotificationHandler from './Notification/Notification'

function App() {
    const [notifications, setNotifications] = useState<Array<NotificationType>>([])
    const [selectedPage, setSelectedPage] = useState<Page>('preference')
    const [responseChain, setResponseChain] = useState<ResponseChain>()

    // Questions and choices for questionnaire page
    const [question, setQuestion] = useState<string>('Sample Question')
    const [choices, setChoices] = useState<Array<string>>([])

    // ID for result page
    const [restaurantId, setRestaurantId] = useState<Array<string>>([])

    // function to change pages; passed into all components as props
    const changePage = (newPage: Page, newResponseChain?: ResponseChain) => {
        console.info('new response chain app', newResponseChain)
        setSelectedPage(newPage)
        setResponseChain(newResponseChain)
        console.info('response chain app', responseChain)
    }

    const renderPage = (newPage: Page, messageChain?: ResponseChain) => {
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
        <>
            <NotificationHandler notifications={notifications} />
            {renderPage(selectedPage, responseChain)}
        </>
    )
}

export default App
