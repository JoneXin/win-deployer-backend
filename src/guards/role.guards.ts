import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { role } = request.query;
    const { token } = request.headers;

    return this.authentication(roles, role, token);
  }

  /**
   * 验证身份
   * @param allowRoles 允许访问的角色
   * @param role 当前角色
   * @param token
   * @returns
   */
  authentication(allowRoles: string[], role: string, token: string) {
    console.log(allowRoles, role, token);

    return true;
  }
}
