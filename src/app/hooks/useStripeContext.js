import { useState, useContext, createContext } from "react";

const StripeContext = createContext({ clientSecret: null });