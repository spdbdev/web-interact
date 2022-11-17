import React from "react";
import interactV1Routes from "./interactV1Routes";
import dashboardRoutes from "./dashboardRoutes";
import metricsRoutes from "./metricsRoutes";
import widgetsRoutes from "./widgetRoutes";
import calendarRoutes from "./calendarRoutes";
import chartRoutes from "./chartRoutes";
import mapRoutes from "./mapRoutes";
import extensionsRoutes from "./extensionsRoutes";
import { Navigate } from "react-router-dom";
import extraRoutes from "./extraRoutes";
import appsRoutes from "./appsRoutes";
import { muiRoutes } from "./muiRoutes";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import listViewRoutes from "./listViewRoutes";
import gridViewRoutes from "./gridViewRoutes";
import oAuthRoutes from "./oAuthRoutes";

const routes = [
  {
    path: "/signin",
    element: <Navigate to={"/a/signin"} />,
  },
  {
    path: "/signup",
    element: <Navigate to={"/a/signup"} />,
  },

  // {
  //     path:
  //         "/createCampaign",
  //     element: <Navigate to={"/a/create-campaign"}/>
  // },
  ...oAuthRoutes,
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
  ...gridViewRoutes
];

export default routes;
