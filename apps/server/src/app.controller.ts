import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
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
  async login(@Request() req: EmployeeEntity) {
    return this.authService.login(req);
  }
}
