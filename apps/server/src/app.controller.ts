import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Res,
  Req,
  HttpException,
  HttpStatus,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AppErrorMessage } from './app.errors';
import { JwtEntity } from './auth/entities/jwt.entity';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { EmployeeEntity } from './employees/entities/employee.entity';
import { AuthService } from './auth/auth.service';
import { Response as ResponseType } from 'express';
import { JwtRefreshAuthGuard } from './auth/guards/jwt-refresh.guard';
import { Request as RequestType } from 'express';
import { EmployeesService } from './employees/employees.service';
import { jwtDecode } from 'jwt-decode';
import { RegisterEmployeeDto } from './auth/dto/register-employee.dto';
import { CreateEmployeeDto } from './employees/dto/create-employee.dto';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private authService: AuthService,
    private employeeService: EmployeesService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/auth/login')
  @UseGuards(LocalAuthGuard)
  @ApiCreatedResponse({ type: JwtEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) response: ResponseType,
  ) {
    const tokens = await this.authService.login(req.user);

    // set the employee's refresh token
    this.employeeService.setRefreshToken(req.user.id, tokens.refreshToken);

    // set-cookie header for jwt and refresh token
    response.setHeader('Set-Cookie', [
      `jwt=${tokens.accessToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_VALID_DURATION}`,
      `refresh=${tokens.refreshToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_DURATION}`,
    ]);
    return tokens;
  }

  @Get('/auth/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: JwtEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async refresh(
    @Req() req: RequestType,
    @Res({ passthrough: true }) response: ResponseType,
  ) {
    // parse the cookies for the user id
    const decoded = jwtDecode(req.cookies['refresh']);
    if (decoded.exp == undefined || decoded.exp - Date.now() / 1000 < 0) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const employee = await this.employeeService.findOneWithRefresh(
      decoded.sub ?? '',
      req.cookies['refresh'],
    );
    if (employee == null) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const tokens = await this.authService.login(new EmployeeEntity(employee));

    // set the employee's new refresh token
    this.employeeService.setRefreshToken(employee.id, tokens.refreshToken);

    // set-cookie header for jwt and refresh token
    response.setHeader('Set-Cookie', [
      `jwt=${tokens.accessToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_VALID_DURATION}`,
      `refresh=${tokens.refreshToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_VALID_DURATION}`,
    ]);
    return tokens;
  }

  @Post('/auth/register')
  @ApiOkResponse({ type: EmployeeEntity })
  @ApiForbiddenResponse({ description: AppErrorMessage.FORBIDDEN })
  @ApiUnprocessableEntityResponse({
    description: AppErrorMessage.UNPROCESSABLE_ENTITY,
  })
  @ApiBadRequestResponse({ description: AppErrorMessage.UNPROCESSABLE_ENTITY })
  async register(
    @Body(new ValidationPipe({ transform: true }))
    registerEmployeeDto: RegisterEmployeeDto,
  ) {
    const { positionName, departmentName, ...employeeDto } =
      registerEmployeeDto;

    const createEmployeeDtoInstance: CreateEmployeeDto = {
      firstName: employeeDto.firstName,
      lastName: employeeDto.lastName,
      email: employeeDto.email,
      password: employeeDto.password,
      signatureLink: employeeDto.signatureLink,
      positionId: '',
      scope: employeeDto.scope,
    };

    const newEmployee = await this.authService.register(
      createEmployeeDtoInstance,
      positionName,
      departmentName,
    );

    return new EmployeeEntity(newEmployee);
  }

  @Get('/auth/logout')
  @ApiOkResponse({ type: undefined })
  async logout(@Res({ passthrough: true }) response: ResponseType) {
    response.setHeader('Set-Cookie', [
      `jwt=; HttpOnly; Path=/; Max-Age=0`,
      `refresh=; HttpOnly; Path=/; Max-Age=0`,
    ]);
  }
}
