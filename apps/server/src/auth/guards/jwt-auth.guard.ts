import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
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
    if (err || !user) {
      console.log(info);
      throw err || new UnauthorizedException();
    }
    return user;
  }

  private isTokenInCookie(request: Request): boolean {
    return request.headers.cookie?.split('=')[0] == 'jwt';
  }

  private isTokenInHeader(request: Request): boolean {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer';
  }
}
