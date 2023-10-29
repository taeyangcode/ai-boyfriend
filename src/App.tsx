import { useState } from 'react'
import UserFilter from './UserFilter/UserFilter'
import Questionnaire from './Questionnaire/Questionnaire'
import Result from './Result/Result'
import NotificationHandler from './Notification/Notification'
import '../src/index.css'

function App() {
    const [notifications, setNotifications] = useState<Array<NotificationType>>([])
    const [selectedPage, setSelectedPage] = useState<Page>('result')
    const [responseChain, setResponseChain] = useState<ResponseChain>()
    console.log('responseChain: ', responseChain)

    // Questions and choices for questionnaire page
    const [question, setQuestion] = useState<string>('Hmmm let me think...')
    const [choices, setChoices] = useState<Array<string>>([])

    // ID for result page
    const [restaurantId, setRestaurantId] = useState<Array<string>>([])

    // function to change pages; passed into all components as props
    const changePage = (newPage: Page, newResponseChain?: ResponseChain) => {
        console.info('new response chain app', newResponseChain)
        setSelectedPage(newPage)
        setResponseChain(newResponseChain)
        console.info('response chain app', responseChain)
        console.log('RENDERING NEW PAGE')
        console.log('new page: ', selectedPage)
        console.log('new response chain: ', responseChain)
        renderPage()
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
                        setResponseChain={setResponseChain}
                    />
                )
            case 'questionnaire':
                return (
                    <Questionnaire
                        changePage={changePage}
                        setRestaurantId={setRestaurantId}
                        question={question}
                        setQuestion={setQuestion}
                        choices={choices}
                        setChoices={setChoices}
                        responseChain={responseChain}
                        setResponseChain={setResponseChain}
                    />
                )
            case 'result':
                return <Result locationIds={restaurantId} />
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
