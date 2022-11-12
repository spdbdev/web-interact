import React from "react";
import ListingDashboard from "../pages/dashboards/listing/ListingDashboard";
import IntranetDashboard from "../pages/dashboards/intranet/IntranetDashboard";

// Interactv1
import SignInPage from "@interact/Pages/SignUpPage/SignInPage";
import Receipts from "@interact/Pages/Receipts/Receipts";
import SignUpPage2 from "@interact/Pages/SignUpPage/SignUpPage2";
import UserProfile from "app/pages/users/user-profile";
import UserProfilePage from "@interact/Pages/UserProfilePage/UserProfilePage";
import Settings from "@interact/Pages/UserProfilePage/Settings";
import CreateCampaignPage from "@interact/Pages/CreateCampaignPage/CreateCampaignPage";
import CampaignPage from "@interact/Pages/CampaignPage/CampaignPage";
import CaptureAuction from "@interact/Pages/CampaignPage/CaptureAuction";
import WhatIsInteractPage from "@interact/Pages/CreateCampaignPage/WhatIsInteractPage";



const interactV1Routes = [
  {
    path: "/interact/signin",
    element: <SignInPage />,
  },
  {
    path: "/interact/signup",
    element: <SignUpPage2/>,
  },
  {
    path: "/interact/receipts",
    element: <Receipts/>,
  },


  {
    path: [
      "/interact/user/",
      "/interact/user/:id"
    ],
    element: <UserProfilePage />, 
  },
  {
    path: "/interact/userold",
    //element: <CrmDashboard/>,
    element: <UserProfilePage />,
  },
  {
    path: "/interact/campaign",
    element: <CampaignPage />,
  },

  {
    path: "/a/settings",
    element: <Settings/>,
  },
  {
    path: "/interact/capture",
    element: <CaptureAuction />
  },

  {
    path: "/interact/createCampaign",
    element: <CreateCampaignPage />,
  },

  {
    path: "/interact/what-is-interact",
    element: <WhatIsInteractPage />,
  },
];

export default interactV1Routes;
