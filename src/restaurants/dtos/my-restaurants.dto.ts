import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common-util/dtos/outputUtil.dto';
import { Restaurant } from '../entities/restaurant.entity';

@ObjectType()
export class MyRestaurantsOutput extends CoreOutput {
  @Field((type) => [Restaurant])
  restaurants?: Restaurant[];
}
