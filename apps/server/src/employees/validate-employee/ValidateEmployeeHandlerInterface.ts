export interface ValidateEmployeeHandler {
  /**
   * Validates the employee by cross referencing the employee data with an authentication provider.
   *
   * @param accessToken the access token to validate
   * @returns whether the employee exists or not
   */
  validateEmployee: (accessToken: string, email: string) => Promise<boolean>;
}
