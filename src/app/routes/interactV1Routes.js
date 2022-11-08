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
    path: "/a/signin",
    element: <SignInPage />,
  },
  {
    path: "/a/signup",
    element: <SignUpPage2 />,
  },
  {
    path: "/u/:username",
    element: (
      <Page component={UserProfilePage} layout="vertical-default" />
    ),
  },
  {
    path: "/u/",
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
    path: "/c/:campaignId",
    element: <CampaignPage />,
  },
  {
    path: "/c/",
    element: <CampaignPage />,
  },
  {
    path: "/d/",
    element: <CampaignPage />,
  },
  {
    path: "/d/:campaignId",
    element: <CampaignPage />,
  },
  {
    path: "/interact/capture",
    element: <CaptureAuction />,
  },

  {
    path: "/a/create-campaign",
    element: <Page component={CreateCampaignPage} layout="solo-page" />,
  },

  {
    path: "/a/what-is-interact",
    element: <Page component={WhatIsInteractPage} layout="solo-page" />,
  },

  {
    path: "/a/campaign-creation-summary",
    element: (
      <Page component={CampaignCreationSummaryPage} layout="solo-page" />
    ),
  },
  {
    path: "/a/campaign-creation-confirmation",
    element: (
      <Page component={CampaignCreationConfirmationPage} layout="solo-page" />
    ),
  },
  {
    path: "/a/faq",
    element: (
      <Page component={<></>} layout="solo-page" />
    ),
  },
  {
    path: "/a/settings",
    element: (
      <Page component={<></>} layout="solo-page" />
    ),
  },
  {
    path: "/a/receipts-and-paystubs",
    element: (
      <Page component={<></>} layout="solo-page" />
    ),
  },
  {
    path: "/a/campaigncreatorfaq",
    element: (
      <Page component={<></>} layout="solo-page" />
    ),
  },
  {
    path: "/a/privacy-policy",
    element: (
      <Page component={<></>} layout="solo-page" />
    ),
  },
  {
    path: "/a/terms-and-conditions",
    element: (
      <Page component={<></>} layout="solo-page" />
    ),
  },
];

export default interactV1Routes;
