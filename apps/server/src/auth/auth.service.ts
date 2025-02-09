import { Injectable } from '@nestjs/common';
import { EmployeesService } from '../employees/employees.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EmployeeEntity } from '../employees/entities/employee.entity';
import { CreateEmployeeDto } from '../employees/dto/create-employee.dto';
import { DepartmentsService } from '../departments/departments.service';
import { PositionsService } from '../positions/positions.service';
import { Department, Position } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private employeesService: EmployeesService,
    private departmentsService: DepartmentsService,
    private positionsService: PositionsService,
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
   * @returns a valid JWT auth and refresh token
   */
  async login(user: EmployeeEntity) {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      sub: user.id,
      positionId: user.positionId,
      departmentId: user.position.departmentId,
      scope: user.scope,
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

  /**
   * Register a new employee.
   * @param createEmployeeDto the employee's data
   * @param positionName the employee's position name
   * @param departmentName the employee's department name
   * @returns the new employee
   */
  async register(
    createEmployeeDto: CreateEmployeeDto,
    positionName: string,
    departmentName: string,
  ) {
    const department: Department =
      await this.departmentsService.findOrCreateOneByName(departmentName);

    const position: Position =
      await this.positionsService.findOrCreateOneByNameInDepartment(
        positionName,
        department.id,
      );

    createEmployeeDto.positionId = position.id;
    const newEmployee = await this.employeesService.create(createEmployeeDto);
    return newEmployee;
  }
}
