import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreUtil } from 'src/common-util/enitites/coreUtil.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Order } from 'src/orders/entities/order.entity';

// type UserRole = 'client' | 'owner' | 'delivery';
export enum Role {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
  Admin = 'Admin',
}
registerEnumType(Role, {
  name: 'Role',
});

// relationships are based on ObjectType hence to avoid name confusion, we rename InputTYpe

@InputType('UserInputType', { isAbstract: true })
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

  // user:owner has multiple restaurants.
  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];

  // user:Client has multiple orders
  @Field((type) => [Order])
  @OneToMany((type) => Order, (order) => order.customer)
  orders: Order[];

  // user:Driver can deliver multiple orders.
  @Field((type) => [Order])
  @OneToMany((type) => Order, (order) => order.driver)
  rides: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    // console.log('called for pass', this.password);
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
        // console.log('after crypt for pass', this.password);
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
