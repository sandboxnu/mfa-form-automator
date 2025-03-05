import { graphConfig } from '@web/authConfig';

export interface GraphUser {
  id: string;
  displayName: string;
  department?: string;
  jobTitle?: string;
  givenName: string;
  surname: string;
  userPrincipalName?: string;
  mail: string;
}

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken
 */
export async function callMsGraph(
  accessToken: string,
): Promise<GraphUser | undefined> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  return fetch(graphConfig.graphMeEndpoint, options)
    .then((response) => response.json())
    .then((data) => {
      return data as GraphUser;
    })
    .catch((error) => {
      console.log(error);
      return undefined;
    });
}
