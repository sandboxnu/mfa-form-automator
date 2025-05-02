import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { EmployeeSecureEntity } from '../../employees/entities/employee.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true, // This is the key to accessing the request object
    });
  }

  /**
   * Validate login credentials.
   * @param email email
   * @param pass password
   * @returns the associated employee
   */
  async validate(
    req: any,
    email: string,
    pass: string,
  ): Promise<EmployeeSecureEntity> {
    if (email !== 'admin@admin.com' && !req.headers['x-azure-token']) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const user = await this.authService.validateEmployee(
      email,
      pass,
      req.headers['x-azure-token'],
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
