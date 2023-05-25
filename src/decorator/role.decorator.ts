import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * 拿到参数中用户信息
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 拿到参数中用户细腻
    const { user } = request.body;

    return data ? user[data] : user;
  },
);
