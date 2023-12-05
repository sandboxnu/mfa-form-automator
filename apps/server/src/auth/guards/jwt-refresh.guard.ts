import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    const request = context.switchToHttp().getRequest<Request>();
    const hasToken =
      this.isTokenInHeader(request) || this.isTokenInCookie(request);
    if (!hasToken) {
      throw new UnauthorizedException();
    }
    return true;
  }
  handleRequest(err: any, user: any, info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException(info);
    }
    return user;
  }

  private isTokenInCookie(request: Request): boolean {
    return 'refresh' in request.cookies;
  }

  private isTokenInHeader(request: Request): boolean {
    const [type] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer';
  }
}
