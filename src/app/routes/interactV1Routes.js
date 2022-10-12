import React from "react";
import ListingDashboard from "../pages/dashboards/listing/ListingDashboard";
import IntranetDashboard from "../pages/dashboards/intranet/IntranetDashboard";

// Interactv1
import SignInPage from "Pages/SignUpPage/SignInPage";
import UserProfile from "app/pages/users/user-profile";
import UserProfilePage from "Pages/UserProfilePage/UserProfilePage";
import CreateCampaignPage from "Pages/CreateCampaignPage/CreateCampaignPage";
import CampaignPage from "Pages/CampaignPage/CampaignPage";

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
    element: <UserProfile />, // use <UserProfilePage /> from @interact/Pages/UserProfilePages to see the old one.
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
];

export default interactV1Routes;
