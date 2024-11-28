import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

// Configuration object constructed.
const config = {
  auth: {
    clientId: '4ba4a1e1-6337-4b28-9f8b-06c82e76e50c',
    // authority: "https://login.microsoftonline.com/390e3543-289a-4ae8-9776-1314872f4235",
  },
  cache: {
    cacheLocation: "localStorage", // or "sessionStorage"
    storeAuthStateInCookie: true,
  },
};

// create PublicClientApplication instance
const publicClientApplication = new PublicClientApplication(config);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MsalProvider instance={publicClientApplication}>
      <App />
    </MsalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
