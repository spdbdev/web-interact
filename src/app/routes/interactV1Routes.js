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

const interactV1Routes = [
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
    element: (
      <Page component={UserProfilePage} layout="vertical-default" />
    ),
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
    element: (
      <Page component={CreateCampaignPage} layout="solo-page" />
    ),
  },

  {
    path: "/interact/what-is-interact",
    element: <WhatIsInteractPage />,
  },

  {
    path: "/interact/campaign-creation-summary",
    element: <CampaignCreationSummaryPage />,
  },
  {
    path: "/interact/campaign-creation-confirmation",
    element: <CampaignCreationConfirmationPage />,
  },
];

export default interactV1Routes;
