import React from "react";
import AboutUs from "../pages/extra-pages/AboutUs";
import CallOuts from "../pages/extra-pages/CallOuts";
import ContactUs from "../pages/extra-pages/ContactUs";
import PricingPage from "../pages/extra-pages/PricingPlan";
import Error404 from "../pages/extra-pages/Error404";
import Error500 from "../pages/extra-pages/Error500";
import LockScreen from "../pages/extra-pages/lock-screen";

const extraRoutes = [
    {
        path: "/extra-pages/about-us",
        element: <AboutUs/>
    },
    {
        path: "/extra-pages/call-outs",
        element: <CallOuts/>,
    },
    {
        path: "/extra-pages/contact-us",
        element: <ContactUs/>
    },
    {
        path: "/extra-pages/pricing-plan",
        element: <PricingPage/>
    },
    {
        path: "/extra-pages/404",
        element: <Error404/>
    },
    {
        path: "/extra-pages/500",
        element: <Error500/>
    },
    {
        path: "/extra-pages/lock-screen",
        element: <LockScreen/>
    },
];

export default extraRoutes;
