import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || 'AZURE_CLIENT_ID',
    authority: `https://login.microsoftonline.com/${
      process.env.AZURE_TENANT_ID || 'common'
    }`,
    redirectUri: process.env.AZURE_REDIRECT_URI || 'http://localhost:3002',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback(logLevel: any, message: any, containsPii: any) {
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
    },
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};
