import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // extract data from http header.
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        // verify the jwt token
        const decoded = this.jwtService.verify(token);
        // if it is object and has id prop
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const id: number = decoded['id'];
          // get the user by id
          const user = await this.userService.findById(id);
          // attach it to the request object
          req['user'] = user;
        }
      } catch (e) {
        console.log(e);
      }
    }
    next();
  }
}
