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
