import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common-util/dtos/outputUtil.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'price',
  'description',
  'options',
]) {
  // restaurantId is not stored so..
  @Field((type) => Int)
  restaurantId: number;
}

@ObjectType()
export class CreateDishOutput extends CoreOutput {}
