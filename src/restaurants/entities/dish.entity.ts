import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreUtil } from 'src/common-util/enitites/coreUtil.entity';
import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
// double cheese , extra salt , ice, patty ...
export class DishChoice {
  @Field((type) => String)
  name: string;
  @Field((type) => Int, { nullable: true })
  extra?: number;
}

// large , medium small fries and such types
// eg. Coca Cola -> Size - choices [{"S",20},{"M",40},{"L",50}]
@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
  @Field((type) => String)
  name: string;
  @Field((type) => [DishChoice], { nullable: true })
  choices?: DishChoice[];
  //   extra price for the option with no choices.
  @Field((type) => Int, { nullable: true })
  extra?: number;
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreUtil {
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  photo: string;

  @Field((type) => Int)
  @Column()
  @IsNumber()
  price: number;

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5, 140)
  description: string;

  //   many dishes to one restaurant
  @Field((type) => Restaurant)
  @ManyToOne((on) => Restaurant, (restaurant) => restaurant.menu, {
    // delete dishes if restaurant is deleted
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  //   gives us restro id so we dont load relations repeatadely
  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  //   storing json data to field instead of creating a new Options table
  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
