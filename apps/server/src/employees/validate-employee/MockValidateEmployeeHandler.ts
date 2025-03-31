import { ValidateEmployeeHandler } from './ValidateEmployeeHandlerInterface';

export class MockValidateEmployeeHandler implements ValidateEmployeeHandler {
  async validateEmployee(accessToken: string, email: string): Promise<boolean> {
    console.log('Mock validate employee:', accessToken, email);
    return true;
  }
}
