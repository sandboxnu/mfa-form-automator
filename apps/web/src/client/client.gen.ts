// This file is auto-generated by @hey-api/openapi-ts

import { appControllerRefresh } from './sdk.gen';
import type { ClientOptions } from './types.gen';
import {
  type Config,
  type ClientOptions as DefaultClientOptions,
  createClient,
  createConfig,
} from '@hey-api/client-axios';

/**
 * The `createClientConfig()` function will be called on client initialization
 * and the returned object will become the client's initial configuration.
 *
 * You may want to initialize your client this way instead of calling
 * `setConfig()`. This is useful for example if you're using Next.js
 * to ensure your client always has the correct values.
 */
export type CreateClientConfig<T extends DefaultClientOptions = ClientOptions> =
  (
    override?: Config<DefaultClientOptions & T>,
  ) => Config<Required<DefaultClientOptions> & T>;

export const client = createClient(createConfig<ClientOptions>());

client.instance.interceptors.response.use(
  (response) => response, // Directly return successful responses.
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.response.config.url !== '/api/auth/refresh'
    ) {
      originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
      try {
        // Make a request to your auth server to refresh the token.
        await appControllerRefresh();
        return client.instance(originalRequest); // Retry the original request with the new access token.
      } catch (refreshError) {
        // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  },
);
