import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EmployeeScope } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class TemplateAuthGuard extends AuthGuard('jwt') {
  private readonly scopes: EmployeeScope[];

  constructor(scopes: EmployeeScope[]) {
    super();
    this.scopes = scopes;
  }

  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    const request = context.switchToHttp().getRequest<Request>();
    const hasToken =
      this.isTokenInHeader(request) || this.isTokenInCookie(request);
    if (!hasToken) {
      throw new UnauthorizedException();
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user || !this.scopes.includes(user.scope)) {
      console.log(info);
      throw err || new UnauthorizedException();
    }
    return user;
  }

  private isTokenInCookie(request: Request): boolean {
    return 'jwt' in request.cookies;
  }

  private isTokenInHeader(request: Request): boolean {
    const [type] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer';
  }
}
