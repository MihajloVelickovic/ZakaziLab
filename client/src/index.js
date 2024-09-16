import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppRoutes from './routes';

//import { PublicClientApplication } from '@azure/msal-browser';
//import { MsalProvider } from '@azure/msal-react';
//import { msalConfig } from './authConfig.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    //<MsalProvider instance={msalInstance}>
        <AppRoutes/>
    //</MsalProvider>
);