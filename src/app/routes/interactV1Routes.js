import React from "react";
import CryptoDashboard from "../pages/dashboards/crypto/CryptoDashboard";
import ListingDashboard from "../pages/dashboards/listing/ListingDashboard";
import CrmDashboard from "../pages/dashboards/crm/CrmDashboard";
import IntranetDashboard from "../pages/dashboards/intranet/IntranetDashboard";
import EcommerceDashboard from "../pages/dashboards/ecommerce/EcommerceDashboard";
import NewsDashboard from "../pages/dashboards/news/NewsDashboard";
import MiscDashboard from "../pages/dashboards/misc/MiscDashboard";

// Interactv1
import SignInPage from '@interact/Pages/SignUpPage/SignInPage';
import UserProfile from "app/pages/users/user-profile";
import UserProfilePage from "@interact/Pages/UserProfilePage/UserProfilePage";



const interactV1Routes = [
    {
        path: "/interact/signin",
        element: <SignInPage/>,
    },
    {
        path: "/interact/signup",
        element: <ListingDashboard/>,
    },
    {
        path: "/interact/user",
        //element: <CrmDashboard/>,
        element: <UserProfile/>, // use <UserProfilePage /> from @interact/Pages/UserProfilePages to see the old one.
    },
    {
        path: "/interact/userold",
        //element: <CrmDashboard/>,
        element: <UserProfilePage/>,  
    },
    {
        path: "/interact/campaign",
        element: <IntranetDashboard/>,
    },
    {
        path: "/interact/createCampaign",
        element: <EcommerceDashboard/>,
    },
];

export default interactV1Routes;
