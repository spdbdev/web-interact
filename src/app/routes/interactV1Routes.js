import React from "react";
import Page from "@jumbo/shared/Page";
import ListingDashboard from "../pages/dashboards/listing/ListingDashboard";
import IntranetDashboard from "../pages/dashboards/intranet/IntranetDashboard";

// Interactv1
import SignInPage from "@interact/Pages/SignUpPage/SignInPage";
import SignUpPage2 from "@interact/Pages/SignUpPage/SignUpPage2";
import UserProfile from "app/pages/users/user-profile";
import UserProfilePage from "@interact/Pages/UserProfilePage/UserProfilePage";
import CreateCampaignPage from "@interact/Pages/CreateCampaignPage/CreateCampaignPage";
import CampaignPage from "@interact/Pages/CampaignPage/CampaignPage";
import CaptureAuction from "@interact/Pages/CampaignPage/CaptureAuction";
import WhatIsInteractPage from "@interact/Pages/CreateCampaignPage/WhatIsInteractPage";
import CampaignCreationSummaryPage from "@interact/Pages/CreateCampaignPage/CampaignCreationSummaryPage";
import CampaignCreationConfirmationPage from "@interact/Pages/CreateCampaignPage/CampaignCreationConfirmationPage";
import Error404 from "app/pages/extra-pages/Error404";
import { Navigate } from "react-router-dom";
import Error500 from "app/pages/extra-pages/Error500";

const interactV1Routes = [
  {
    path: "*",
    element: <Navigate to="/a/400"/>,
  },
  {
    path: "/a/400",
    element: <Error404/>
  },
  {
    path: "/a/500",
    element: <Error500/>
  },
  {
    path: "/interact/signin",
    element: <SignInPage />,
  },
  {
    path: "/interact/signup",
    element: <SignUpPage2 />,
  },
  {
    path: "/interact/user",
    element: <Page component={UserProfilePage} layout="vertical-default" />,
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
    path: "/interact/capture",
    element: <CaptureAuction />,
  },

  {
    path: "/interact/createCampaign",
    element: <Page component={CreateCampaignPage} layout="solo-page" />,
  },

  {
    path: "/interact/what-is-interact",
    element: <Page component={WhatIsInteractPage} layout="solo-page" />,
  },

  {
    path: "/interact/campaign-creation-summary",
    element: (
      <Page component={CampaignCreationSummaryPage} layout="solo-page" />
    ),
  },
  {
    path: "/interact/campaign-creation-confirmation",
    element: (
      <Page component={CampaignCreationConfirmationPage} layout="solo-page" />
    ),
  },
];

export default interactV1Routes;
