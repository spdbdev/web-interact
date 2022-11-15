import React from "react";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import NewspaperIcon from "@mui/icons-material/Newspaper";

const interactMenus = [
  {
    label: "sidebar.menu.home",
    type: "section",
    children: [
      {
        uri: "/dashboards/misc",
        label: "Sign In",
        type: "nav-item",
        icon: <GraphicEqIcon sx={{ fontSize: 20 }} />,
      },
      {
        uri: "/dashboards/listing",
        label: "Sign Up",
        type: "nav-item",
        icon: <ListAltOutlinedIcon sx={{ fontSize: 20 }} />,
      },
      {
        uri: "/u/",
        label: "User Profile",
        type: "nav-item",
        icon: <SupportAgentOutlinedIcon sx={{ fontSize: 20 }} />,
      },
      {
        uri: "/c/",
        label: "Campaign",
        type: "nav-item",
        icon: <PieChartOutlineOutlinedIcon sx={{ fontSize: 20 }} />,
      },
      {
        uri: "/a/what-is-interact",
        label: "Create Campaign",
        type: "nav-item",
        icon: <ShoppingCartOutlinedIcon sx={{ fontSize: 20 }} />,
      },
    ],
  },

  {
    label: "sidebar.menu.apps",
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
