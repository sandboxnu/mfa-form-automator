import { Request } from 'express';

export class StrategyUtils {
  public static extractJWT(req: Request): string | null {
    if (req.cookies && 'jwt' in req.cookies && req.cookies.jwt.length > 0) {
      return req.cookies.jwt;
    }
    return null;
  }
}
