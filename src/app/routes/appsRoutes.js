import React from "react";
import MailApp from "../pages/apps/mail";
import ContactsApp from "../pages/apps/contacts/ContactsApp";
import ChatApp from "../pages/apps/chat";

const appsRoutes = [
    {
        path: [
            "/app/chats",
            "/app/chats/:chatBy/:id",
        ],
        element: <ChatApp/>,
    },
    {
        path: [
            "/app/contacts/:category",
            "/app/contacts/:category/:id",
        ],
        element: <ContactsApp/>,
    },
    {
        path: [
            "/app/mails/:category",
            "/app/mails/:category/:id",
            "/app/mails/:category/message/:messageID",
            "/app/mails/:category/:id/message/:messageID"
        ],
        element: <MailApp/>
    }
];

export default appsRoutes;
