import { Request as RequestType } from 'express';

export class StrategyUtils {
  public static extractJWT(req: RequestType): string | null {
    if (req.cookies && 'jwt' in req.cookies && req.cookies.jwt.length > 0) {
      return req.cookies.jwt;
    }
    return null;
  }
}
