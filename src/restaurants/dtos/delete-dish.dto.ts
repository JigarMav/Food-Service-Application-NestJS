import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common-util/dtos/outputUtil.dto';

@InputType()
export class DeleteDishInput {
  @Field((type) => Int)
  dishId: number;
}

@ObjectType()
export class DeleteDishOutput extends CoreOutput {}
