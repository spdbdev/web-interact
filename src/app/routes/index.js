import React from "react";
import interactV1Routes from "./interactV1Routes";
import dashboardRoutes from "./dashboardRoutes";
import metricsRoutes from "./metricsRoutes";
import widgetsRoutes from "./widgetRoutes";
import calendarRoutes from "./calendarRoutes";
import chartRoutes from "./chartRoutes";
import mapRoutes from "./mapRoutes";
import extensionsRoutes from "./extensionsRoutes";
import {Navigate} from "react-router-dom";
import extraRoutes from "./extraRoutes";
import appsRoutes from "./appsRoutes";
import {muiRoutes} from "./muiRoutes";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import listViewRoutes from "./listViewRoutes";
import gridViewRoutes from "./gridViewRoutes";

const routes = [
    {
        path:
            "/",
        element: <Navigate to={"/interact/signin"}/>
    },
    
    {
        path:
            "/signin",
        element: <Navigate to={"/interact/signin"}/>
    },


    {
        path:
            "/signup",
        element: <Navigate to={"/interact/signup"}/>
    },


    {
        path:
            "/user",
        element: <Navigate to={"/interact/user"}/>
    },

    {
        path:
            "/campaign",
        element: <Navigate to={"/interact/campaign"}/>
    },

    {
        path:
            "/createCampaign",
        element: <Navigate to={"/interact/createCampaign"}/>
    },

    ...interactV1Routes,
    ...dashboardRoutes,
    ...appsRoutes,
    ...widgetsRoutes,
    ...metricsRoutes,
    ...muiRoutes,
    ...extensionsRoutes,
    ...calendarRoutes,
    ...chartRoutes,
    ...mapRoutes,
    ...authRoutes,
    ...extraRoutes,
    ...userRoutes,
    ...listViewRoutes,
    ...gridViewRoutes,
];

export default routes;
