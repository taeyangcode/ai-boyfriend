import { useState } from 'react'
import UserFilter from './UserFilter/UserFilter'
import Questionnaire from './Questionnaire/Questionnaire'
import Result from './Result/Result'
import NotificationHandler from './Notification/Notification'

function App() {
    const [notifications, setNotifications] = useState<Array<NotificationType>>(
        []
    )
    const [selectedPage, setSelectedPage] = useState<Page>('preference')

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
                    />
                )
            case 'questionnaire':
                return <Questionnaire />
            case 'result':
                return <Result />
            default:
                return (
                    <>
                        <h1>Page not found</h1>
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
