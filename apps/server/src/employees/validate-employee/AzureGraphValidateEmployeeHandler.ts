import { Injectable } from '@nestjs/common';
import { ValidateEmployeeHandler } from './ValidateEmployeeHandlerInterface';
import { GraphUser } from './types';

const GRAPH_ME_ENDPOINT =
  'https://graph.microsoft.com/v1.0/me?$select=id,displayName,department,jobTitle,givenName,surname,userPrincipalName,mail';

@Injectable()
export class AzureGraphValidateEmployeeHandler
  implements ValidateEmployeeHandler
{
  async callMsGraph(accessToken: string): Promise<GraphUser | undefined> {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;

    headers.append('Authorization', bearer);

    const options = {
      method: 'GET',
      headers: headers,
    };

    return fetch(GRAPH_ME_ENDPOINT, options)
      .then((response) => response.json())
      .then((data) => {
        return data as GraphUser;
      })
      .catch((error) => {
        console.log(error);
        return undefined;
      });
  }

  async validateEmployee(accessToken: string, email: string): Promise<boolean> {
    const graphUser = await this.callMsGraph(accessToken);

    if (!graphUser) {
      return false;
    }

    console.log(graphUser);
    console.log(email);

    return graphUser.mail === email;
  }
}
