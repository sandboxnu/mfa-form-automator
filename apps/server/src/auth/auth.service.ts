import { Injectable } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmployeeEntity } from '../employees/entities/employee.entity';

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
  ): Promise<EmployeeEntity | null> {
    const user = await this.employeesService.findOneByEmail(email);
    if (user?.pswdHash && !(await bcrypt.compare(pass, user.pswdHash!))) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pswdHash, ...result } = user;
    return new EmployeeEntity(result);
  }

  /**
   * Authenticate a user.
   * @param request the incoming request
   * @returns a valid JWT auth token
   */
  async login(request: any) {
    const payload = {
      email: request.user.email,
      firstName: request.user.firstName,
      lastName: request.user.lastName,
      sub: request.user.id,
      positionId: request.user.positionId,
      isAdmin: request.user.isAdmin,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: `${process.env.JWT_VALID_DURATION}s`,
      }),
    };
  }
}
