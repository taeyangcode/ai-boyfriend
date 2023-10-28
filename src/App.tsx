import { useState } from 'react'
import UserFilter from './UserFilter/UserFilter'
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
            // case 'questionnaire':
            //     return <Questionnaire />
            // case 'result':
            //     return <Result />
            default:
                return (
                    <>
                        <div>Page not found</div>
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
