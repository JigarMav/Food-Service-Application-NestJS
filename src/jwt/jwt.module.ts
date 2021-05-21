import { DynamicModule, Global, Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtModuleOptions } from './jwt.interface';
import { JwtService } from './jwt.service';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService],
      providers: [
        {
          provide: 'option',
          useValue: options,
        },
        JwtService,
      ],
    };
  }
}
