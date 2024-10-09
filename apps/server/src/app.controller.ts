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
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiBearerAuth,
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

  @UseGuards(LocalAuthGuard)
  @Post('/auth/login')
  @ApiOkResponse({ type: JwtEntity })
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
    console.log(req.user);
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

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/auth/refresh')
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

  @Get('/auth/logout')
  @ApiOkResponse({ type: undefined })
  async logout(@Res({ passthrough: true }) response: ResponseType) {
    response.setHeader('Set-Cookie', [
      `jwt=; HttpOnly; Path=/; Max-Age=0`,
      `refresh=; HttpOnly; Path=/; Max-Age=0`,
    ]);
  }
}
