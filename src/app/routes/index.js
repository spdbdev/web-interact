import React from "react";
import interactV1Routes from "./interactV1Routes";
import { Navigate } from "react-router-dom";
import oAuthRoutes from "./oAuthRoutes";

const routes = [
  {
    path: "/",
    element: <Navigate to={"/a/signin"} />,
  },
  {
    path: "/signin",
    element: <Navigate to={"/a/signin"} />,
  },
  {
    path: "/signup",
    element: <Navigate to={"/a/signup"} />,
  },
  ...oAuthRoutes,
  ...interactV1Routes,
];

export default routes;
