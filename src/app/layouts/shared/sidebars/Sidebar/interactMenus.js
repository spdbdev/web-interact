import React from "react";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";

const interactMenus = [
  {
    label: "sidebar.menu.home",
    type: "section",
    children: [
      {
        uri: "/u/"+user?.name,
        label: "Profile",
        type: "nav-item",
        icon: <PersonOutlineIcon sx={{ fontSize: 20 }} />,
      },
      {
        uri: "/a/what-is-interact",
        label: "Start a campaign",
        type: "nav-item",
        icon: <EditOutlinedIcon sx={{ fontSize: 20 }} />,
      },
    ],
  },

  {
    label: "FOLLOWING",
    type: "section",
    children: [
      {
        uri: "/app/chats",
        label: "sidebar.menuItem.chat",
        type: "nav-item",
        icon: <ChatOutlinedIcon sx={{ fontSize: 20 }} />,
      },
      {
        uri: "/app/contacts/all",
        label: "sidebar.menuItem.contacts",
        type: "nav-item",
        icon: <ContactsOutlinedIcon sx={{ fontSize: 20 }} />,
      },
      {
        uri: "/app/mails/inbox",
        label: "sidebar.menuItem.mail",
        type: "nav-item",
        icon: <EmailOutlinedIcon sx={{ fontSize: 20 }} />,
      },
    ],
  },
];

export default interactMenus;
