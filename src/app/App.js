import React, {Suspense} from "react";
import {Provider} from "react-redux";
import {BrowserRouter} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import JumboApp from "@jumbo/components/JumboApp";
import AppLayout from "./AppLayout";
import JumboTheme from "@jumbo/components/JumboTheme";
import AppRoutes from "./AppRoutes";
import configureStore, {history} from './redux/store';
import JumboDialog from "@jumbo/components/JumboDialog";
import JumboDialogProvider from "@jumbo/components/JumboDialog/JumboDialogProvider";
import {SnackbarProvider} from "notistack";
import "./services/apis";
import AppProvider from "./AppProvider";
import {config} from "./config/main";
import JumboRTL from "@jumbo/JumboRTL/JumboRTL";
import Div from "@jumbo/shared/Div";
import {CircularProgress} from "@mui/material";

import { loadStripe } from '@stripe/stripe-js/pure';
import { Elements } from '@stripe/react-stripe-js';
import CaptureAuction from '@interact/Pages/CampaignPage/CaptureAuction';
const stripePromise = loadStripe('pk_test_51LJU6pIRYjPm2gCpQ07Vg68jRq7XfRVpVLSygsbAR4r42iZCN3hWueDFUxeOXxHBiUg3tUp9ciZE4mfQjsFpIxEN00g6y5PWRS');

localStorage.clear();


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const store = configureStore();

function App() {
    return (
        <Elements stripe={stripePromise}>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <BrowserRouter history={history}>
                    <AppProvider>
                        <JumboApp activeLayout={config.activeLayout}>
                            <JumboTheme init={config.theme}>
                                <JumboRTL>
                                    <JumboDialogProvider>
                                        <JumboDialog/>
                                        <SnackbarProvider
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right',
                                            }}
                                            maxSnack={3}>

                                            <AppLayout>
                                                <Suspense
                                                    fallback={
                                                        <Div
                                                            sx={{
                                                                display: 'flex',
                                                                minWidth: 0,
                                                                alignItems: 'center',
                                                                alignContent: 'center',
                                                                height: '100%',
                                                            }}
                                                    >
                                                            <CircularProgress sx={{m: '-40px auto 0'}}/>
                                                        </Div>
                                                    } 
                                                >
                                                    <AppRoutes/>
                                                </Suspense>
                                            </AppLayout>

                                        </SnackbarProvider>
                                    </JumboDialogProvider>
                                </JumboRTL>
                            </JumboTheme>
                        </JumboApp>
                    </AppProvider>
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
        </Elements>
    );
}

export default App;
