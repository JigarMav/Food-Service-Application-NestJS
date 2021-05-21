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
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verify(token);
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const id: number = decoded['id'];

          const user = await this.userService.findById(id);
          console.log(user);
          req['user'] = user;
        }
      } catch (e) {}
    }
    next();
  }
}
