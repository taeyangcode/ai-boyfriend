import { ReactNode } from "react";

function ErrorNotification({ code, message }: ErrorDetails): ReactNode {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <strong className="font-bold">{code}</strong>
            <span className="block sm:inline">{message}</span>
        </div>
    );
}

interface Props {
    notifications: Array<NotificationType>;
}

function NotificationHandler({ notifications }: Props) {
    return (
        <div className="absolute top-0 right-0">
            {notifications?.map((notification) => ErrorNotification(notification))}
        </div>
    );
}

export default NotificationHandler;
