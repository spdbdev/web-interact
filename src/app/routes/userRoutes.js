import React from "react";
import UserProfile from "../pages/users/user-profile";
import WallApp from "../pages/users/wall-app";

const userRoutes = [
    {
        path: "/user/profile",
        element: <UserProfile/>
    },
    {
        path: "/user/social-wall",
        element: <WallApp/>
    }
];
export default userRoutes;
