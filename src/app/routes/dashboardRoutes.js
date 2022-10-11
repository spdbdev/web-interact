import React from "react";
import CryptoDashboard from "../pages/dashboards/crypto/CryptoDashboard";
import ListingDashboard from "../pages/dashboards/listing/ListingDashboard";
import CrmDashboard from "../pages/dashboards/crm/CrmDashboard";
import IntranetDashboard from "../pages/dashboards/intranet/IntranetDashboard";
import EcommerceDashboard from "../pages/dashboards/ecommerce/EcommerceDashboard";
import NewsDashboard from "../pages/dashboards/news/NewsDashboard";
import MiscDashboard from "../pages/dashboards/misc/MiscDashboard";

const dashboardRoutes = [
    {
        path: "/dashboards/crypto",
        element: <CryptoDashboard/>,
    },
    {
        path: "/dashboards/listing",
        element: <ListingDashboard/>,
    },
    {
        path: "/dashboards/crm",
        element: <CrmDashboard/>,
    },
    {
        path: "/dashboards/intranet",
        element: <IntranetDashboard/>,
    },
    {
        path: "/dashboards/ecommerce",
        element: <EcommerceDashboard/>,
    },
    {
        path: "/dashboards/news",
        element: <NewsDashboard/>,
    },
    {
        path: "/dashboards/misc",
        element: <MiscDashboard/>
    }
];

export default dashboardRoutes;
