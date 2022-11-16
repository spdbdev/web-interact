import React from "react";
import Page from "@jumbo/shared/Page";
import ListingDashboard from "../pages/dashboards/listing/ListingDashboard";
import IntranetDashboard from "../pages/dashboards/intranet/IntranetDashboard";

// Interactv1
import SignInPage from "@interact/Pages/SignUpPage/SignInPage";
import SignUpPage2 from "@interact/Pages/SignUpPage/SignUpPage2";
import UserProfile from "app/pages/users/user-profile";
import UserProfilePage from "@interact/Pages/UserProfilePage/UserProfilePage";
import Settings from "@interact/Pages/UserProfilePage/Settings";
import CreateCampaignPage from "@interact/Pages/CreateCampaignPage/CreateCampaignPage";
import CampaignPage from "@interact/Pages/CampaignPage/CampaignPage";
import TermsAndConditionsPage from "@interact/Pages/TermsAndPolicyPage/TermsAndConditionsPage";
import PrivacyPolicyPage from "@interact/Pages/TermsAndPolicyPage/PrivacyPolicyPage";
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
    path: "/a/signin",
    element: <SignInPage />,
  },
  {
    path: "/a/signup",
    element: <SignUpPage2 />,
  },
  {
    path: "/a/termsandconditions",
    element: <TermsAndConditionsPage/>,
  },
  {
    path: "/a/privacypolicy",
    element: <PrivacyPolicyPage/>,
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
    path: "/a/settings",
    element: <Settings/>,
  },
  {
    path: "/c/",
    element: <CampaignPage />,
  },

  {
    path: "/d/:campaignId",
    element: <Page component={CreateCampaignPage} layout="solo-page" />,
  },
  {
    path: "/interact/capture",
    element: <CaptureAuction />,
  },
  {
    path: "/a/create-campaign",
    element: (
    <Page component={CreateCampaignPage} layout="solo-page" />
    )
  },

  {
    path: "/a/what-is-interact",
    element: <Page component={WhatIsInteractPage} layout="solo-page" />,
  },

  {
    path: "/a/campaign-creation-summary/:campaignId",
    element: (
      <Page component={CampaignCreationSummaryPage} layout="solo-page" />
    ),
  },
  {
    path: "/a/campaign-creation-confirmation/:campaignId",
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
