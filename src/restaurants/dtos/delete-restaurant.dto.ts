import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common-util/dtos/outputUtil.dto';

@InputType()
export class DeleteRestaurantInput {
  @Field((type) => Number)
  restaurantId: number;
}

@ObjectType()
export class DeleteRestaurantOutput extends CoreOutput {}
