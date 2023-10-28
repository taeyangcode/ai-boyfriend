import { useState } from "react";
import UserFilter from "./UserFilter/UserFilter";
import NotificationHandler from "./Notification/Notification";

function App() {
    const [notifications, setNotifications] = useState<Array<NotificationType>>([]);

    return (
        <>
            <NotificationHandler notifications={notifications} setNotifications={setNotifications} />
            <UserFilter notifications={notifications} setNotifications={setNotifications} />;
        </>
    );
}

export default App;
