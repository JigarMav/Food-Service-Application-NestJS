import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateRestaurantDto } from './create-restaurant.dto';

// EditRestaurantInput partialtype so as all args become optional as we can edit any field.
@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantDto) {}

// takes 2 args in controller.
// id and input of type EditRestaurantInput.

@InputType()
export class EditRestaurantDto {
  @Field((type) => Number)
  id: number;

  @Field((type) => EditRestaurantInput)
  data: EditRestaurantInput;
}
