import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { CoreUtil } from 'src/common-util/enitites/coreUtil.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { Category } from './category.entity';

// reused by gql and orm at same time

// relationships are based on ObjectType hence to avoid name confusion, we rename InputTYpe
@InputType('RestaurantInputType', { isAbstract: true })
// for graphql
@ObjectType()
// for typeORM
@Entity()
export class Restaurant extends CoreUtil {
  @Field((type) => String)
  @Column({ name: 'name' })
  @IsString()
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImg: string;

  // a restaurant can have one owner.
  // owner can have many restaurants.
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;
  // A restaurant can have only one category but category can have many restaurants.
  //   if category is deleted , dont delete the restaurants.
  @Field((type) => Category, { nullable: true })
  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  category: Category;
}
