import { Injectable } from '@nestjs/common';
import { EmployeesService } from '@server/employees/employees.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmployeeEntity } from '../employees/entities/employee.entity';

@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  async validateEmployee(email: string, pass: string): Promise<any | null> {
    const user = await this.employeesService.findOneByEmail(email);
    if (user?.pswdHash && !(await bcrypt.compare(pass, user.pswdHash!))) {
      return null;
    }
    const { pswdHash, ...result } = user;
    return result;
  }

  async login(employee: any) {
    const payload = { email: employee.user.email, sub: employee.user.id };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: `${process.env.JWT_VALID_DURATION}s`,
      }),
    };
  }
}
