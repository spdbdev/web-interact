import React from "react";
import Login1 from "../pages/auth-pages/login1";
import Login2 from "../pages/auth-pages/login2";
import Signup1 from "../pages/auth-pages/signup1";
import Signup2 from "../pages/auth-pages/signup2";
import ForgotPassword from "../pages/auth-pages/forgot-password";
import ResetPassword from "../pages/auth-pages/reset-password";

const authRoutes = [
    {
        path: "/auth-pages/login-1",
        element: <Login1/>,
    },
    {
        path: "/auth-pages/login-2",
        element: <Login2/>
    },
    {
        path: "/auth-pages/signup-1",
        element: <Signup1/>
    },
    {
        path: "/auth-pages/signup-2",
        element: <Signup2/>
    },
    {
        path: "/auth-pages/forgot-password",
        element: <ForgotPassword/>
    },
    {
        path: "/auth-pages/reset-password",
        element: <ResetPassword/>
    }
];

export default authRoutes;
