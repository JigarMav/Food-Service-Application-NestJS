import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreUtil } from 'src/common-util/enitites/coreUtil.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

// type UserRole = 'client' | 'owner' | 'delivery';
enum Role {
  client,
  owner,
  delivery,
  admin,
}
registerEnumType(Role, {
  name: 'Role',
});

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreUtil {
  @Column()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: 'enum', enum: Role })
  @Field((type) => Role)
  role: Role;

  @BeforeInsert()
  // @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(pass: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare<boolean>(pass, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
