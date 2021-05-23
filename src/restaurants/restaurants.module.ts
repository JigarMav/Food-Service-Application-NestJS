import { Module } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { CategoryRepository } from './entities/category.repository';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';
import {
  CategoryResolver,
  DishResolver,
  RestaurantResolver,
} from './restaurants.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository, Dish])],
  providers: [
    RestaurantResolver,
    RestaurantService,
    CategoryResolver,
    DishResolver,
  ],
})
export class RestaurantsModule {}
