import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "c589e5ca-2dd7-40d2-b982-0a13a93b691d",
        authority: "https://login.microsoftonline.com/organizations/vietanh872001gmail.onmicrosoft.com",
        // // login
        redirectUrl:  "https://ten-tsuh.vercel.app/login",
        postLogoutRedirectUri: "https://ten-tsuh.vercel.app/login",
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback(logLevel, message, containsPii) {
                if (containsPii) {
                    return;
                }
                switch (logLevel) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
            logLevel: LogLevel.Verbose,
        },
    },
};

export const loginRequest = {
    scopes: ["User.Read"],
};