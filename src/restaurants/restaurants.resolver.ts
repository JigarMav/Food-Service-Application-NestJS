import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  @Query((returns) => [Restaurant])
  restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }

  @Mutation((returns) => Boolean)
  createRestaurant(@Args() CreateRestaurantDto: CreateRestaurantDto): boolean {
    return true;
  }
}
