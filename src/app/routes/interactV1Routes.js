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
import CaptureAuction from "@interact/Pages/CampaignPage/CaptureAuction";
import WhatIsInteractPage from "@interact/Pages/CreateCampaignPage/WhatIsInteractPage";
import CampaignCreationSummaryPage from "@interact/Pages/CreateCampaignPage/CampaignCreationSummaryPage";
import CampaignCreationConfirmationPage from "@interact/Pages/CreateCampaignPage/CampaignCreationConfirmationPage";
import Error404 from "app/pages/extra-pages/Error404";
import { Navigate } from "react-router-dom";
import Error500 from "app/pages/extra-pages/Error500";

import AuthGuard from "@jumbo/services/auth/AuthGuard";
import LandingPage from "@interact/Pages/LandingPage/LandingPage";
import FaqPage from '@interact/Pages/FaqPage';
import CampaignCreatorFaqPage from "@interact/Pages/CampaignCreatorFaqPage";
import TermsAndConditionsPage from "@interact/Pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "@interact/Pages/PrivacyPolicyPage";

const interactV1Routes = [
  {
    path: "*",
    element: <Error404 layout="vertical-default" />
  },
  {
    path: "/a/404",
    element: <Error404 layout="vertical-default" />
  },
  {
    path: "/a/500",
    element: <Error500 layout="vertical-default" />
  },
  {
    path: "/a/signin",
    element: <SignInPage layout="vertical-default" />,
  },
  {
    path: "/a/signup",
    element: <SignUpPage2 layout="vertical-default" />,
  },
  {
    path: "/a/terms-conditions",
    element: <TermsAndConditionsPage layout="vertical-default" />,
  },
  {
    path: "/a/privacy-policy",
    element: <PrivacyPolicyPage layout="vertical-default" />,
  },
  {
    path: "/a/faq",
    element: <FaqPage layout="vertical-default" />
  },
  {
    path: "/a/campaign-creator-faq",
    element: <CampaignCreatorFaqPage layout="vertical-default" />
  },
  {
    path: "/u/:username",
    element: (
      <AuthGuard>
        <Page component={UserProfilePage} layout="vertical-default" />
      </AuthGuard>
    ),
  },
  {
    path: "/u/",
    element: (
      <AuthGuard>
        <Page component={UserProfilePage} layout="vertical-default" />
      </AuthGuard>
    ),
  },
  {
    path: "/c/:campaignId",
    element: <CampaignPage layout="vertical-default" />,
  },

  {
    path: "/a/settings",
    element: <Settings layout="vertical-default" />,
  },
  {
    path: "/c/",
    element: <CampaignPage layout="vertical-default" />,
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
    <AuthGuard>
    <Page component={CreateCampaignPage} layout="solo-page" />
    </AuthGuard>),
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
    path: "/a/settings",
    element: (
      <Page component={<></>} layout="solo-page" />
    ),
  },
  {
    path: "/",
    element: <LandingPage layout="vertical-default" />
    // element: (
    //   <Page component={LandingPage} layout="solo-page" />
    // ),
  },
];

export default interactV1Routes;
