import React from "react";
import ListingDashboard from "../pages/dashboards/listing/ListingDashboard";
import IntranetDashboard from "../pages/dashboards/intranet/IntranetDashboard";

// Interactv1
import SignInPage from "@interact/Pages/SignUpPage/SignInPage";
import UserProfile from "app/pages/users/user-profile";
import UserProfilePage from "@interact/Pages/UserProfilePage/UserProfilePage";
import CreateCampaignPage from "@interact/Pages/CreateCampaignPage/CreateCampaignPage";
import CampaignPage from "@interact/Pages/CampaignPage/CampaignPage";
import WhatIsInteractPage from "@interact/Pages/CreateCampaignPage/WhatIsInteractPage";

const interactV1Routes = [
  {
    path: "/interact/signin",
    element: <SignInPage />,
  },
  {
    path: "/interact/signup",
    element: <ListingDashboard />,
  },
  {
    path: "/interact/user",
    //element: <CrmDashboard/>,
    element: <UserProfilePage />, // use <UserProfilePage /> from @interact/Pages/UserProfilePages to see the old one.
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
    path: "/interact/createCampaign",
    element: <CreateCampaignPage />,
  },
  {
    path: "/interact/what-is-interact",
    element: <WhatIsInteractPage />,
  },
];

export default interactV1Routes;
