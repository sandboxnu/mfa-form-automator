import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { EmployeeSecureEntity } from '../../employees/entities/employee.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validate login credentials.
   * @param email email
   * @param pass password
   * @returns the associated employee
   */
  async validate(email: string, pass: string): Promise<EmployeeSecureEntity> {
    const user = await this.authService.validateEmployee(email, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
