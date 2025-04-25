import { Injectable } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmployeeSecureEntityHydrated } from '../employees/entities/employee.entity';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate an employee's credentials.
   * @param email the employee's email
   * @param pass the employee's raw text password
   * @returns an employee
   */
  async validateEmployee(
    email: string,
    pass: string,
  ): Promise<EmployeeSecureEntityHydrated | null> {
    try {
      const user = await this.employeesService.findOneByEmailAuth(email);

      if (user?.pswdHash && !(await bcrypt.compare(pass, user.pswdHash!))) {
        return null;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { pswdHash, ...result } = user;
      return new EmployeeSecureEntityHydrated(result);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
        return null;
      }
    }
    return null;
  }

  /**
   * Authenticate a user.
   * @param request the incoming request
   * @returns a valid JWT auth and refresh token
   */
  async login(user: EmployeeSecureEntityHydrated) {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      sub: user.id,
      positionId: user.positionId,
      departmentId: user.position?.department.id,
      scope: user.scope,
      position: user.position,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: `${process.env.JWT_VALID_DURATION}s`,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: `${process.env.JWT_REFRESH_VALID_DURATION}s`,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
