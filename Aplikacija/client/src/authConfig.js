// src/authConfig.js
import { LogLevel } from "@azure/msal-browser";


const YOUR_TENANT_ID = "f5501f2a-b2b9-4122-8f2d-aa0f0366d907";
const YOUR_CLIENT_ID = "09240e83-aecb-4f19-a63a-ce3201c5426e";

export const msalConfig = {
  auth: {
    clientId: `${YOUR_CLIENT_ID}`, // Replace with your client ID
    authority: `https://login.microsoftonline.com/${YOUR_TENANT_ID}`, // Replace with your tenant ID
    redirectUri: "http://localhost:3000", // Replace with your redirect URI
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set to true if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
          default:
            break;
        }
      },
    },
  },
};

export const loginRequest = {
  scopes: ["User.Read"], // Add other scopes as needed
};
