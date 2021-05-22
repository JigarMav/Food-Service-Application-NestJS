import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { Role, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // to get metadata we use reflectors
    const roles = this.reflector.get<Role>('roles', context.getHandler());
    // public endpoint
    if (!roles) {
      return true;
    }
    // current context is in HTTP .
    // convert to graphql context.
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user: User = gqlContext.user;
    if (!user) return false;
    if (roles.includes('Any')) {
      return true;
    }
    return roles.includes(user.role);
    // const token = gqlContext.token;
    // console.log('token authg', gqlContext.user);
    // verify jsontoken
    // if (token) {
    //   const decoded = this.jwtService.verify(token.toString());
    //   if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
    //     const user = await this.userService.findById(decoded['id']);
    //     console.log('Curr user', user.id);
    //     if (user) {
    //       gqlContext['user'] = user;
    //       console.log('user role', user.role);
    //       if (roles.includes('Any')) {
    //         return true;
    //       }
    //       return roles.includes(user.role);
    //     }
    //   }
    // }
    // return false;
  }
}
