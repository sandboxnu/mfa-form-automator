import { SetMetadata, createParamDecorator } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const AuthUser = createParamDecorator((data, req) => {
  return new UserEntity(req.getArgs()[0].user);
});
