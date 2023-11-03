import { Controller, Get, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AppErrorMessage } from './app.errors';
import { JwtEntity } from './auth/entities/jwt.entity';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { EmployeeEntity } from './employees/entities/employee.entity';
import { AuthService } from './auth/auth.service';
import { Response as ResponseType } from 'express';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
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
    @Request() req: EmployeeEntity,
    @Res({ passthrough: true }) response: ResponseType,
  ) {
    const jwtToken = await this.authService.login(req);
    response.setHeader(
      'Set-Cookie',
      `jwt=${jwtToken.access_token}; HttpOnly; Path=/; Max-Age=${60000}`,
    );
    return jwtToken;
  }

  @Get('/auth/logout')
  @ApiOkResponse({ type: undefined })
  async logout(@Res({ passthrough: true }) response: ResponseType) {
    response.setHeader('Set-Cookie', `jwt=; HttpOnly; Path=/; Max-Age=0`);
  }
}
