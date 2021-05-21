import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
const jwt = require('jsonwebtoken');

// injectable of repos .DI
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly user: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    console.log(this.config.get('SECRET_KEY'));
    this.jwtService.hello();
  }

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const exists = await this.user.findOne({ email });
      if (exists) {
        return { ok: false, error: 'User already Exists!' };
      }
      await this.user.save(this.user.create({ email, password, role }));
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'couldnt create account' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.user.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'User not found!',
        };
      }

      const checkPass = await user.checkPassword(password);
      console.log(checkPass);
      if (!checkPass) {
        return {
          ok: false,
          error: 'Wrong password ',
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<User> {
    // console.log(id);

    try {
      const user = await this.user.findOneOrFail({ id });
      return user;
    } catch (error) {
      console.log('  dfjskdfslf ');
    }
    return null;

    // try {
    //   const user = await this.user.findOneOrFail({ id });
    //   return {
    //     ok: true,
    //     user,
    //   };
    // } catch (error) {
    //   return { ok: false, error: 'User Not Found' };
    // }
  }

  async editProfile(
    id: number,
    editprofileInput: EditProfileInput,
  ): Promise<User> {
    const { email, password } = editprofileInput;

    const currUser = await this.user.findOne(id);
    // console.log(currUser);
    // console.log(password);
    if (email) {
      currUser.email = email;
    }
    if (password) {
      currUser.password = password;
    }
    console.log('updated', currUser);
    return this.user.save(currUser);
    // return {
    //   ok: true,
    // };
  }
}
