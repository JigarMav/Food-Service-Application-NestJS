import { Injectable, Query } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Raw, Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/get-restaurant.dto';
import { RestaurantsOutput, RestaurantsInput } from './dtos/restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurants.dto';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './entities/category.repository';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurant: Repository<Restaurant>,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
    private readonly categories: CategoryRepository,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurant.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName,
      );
      newRestaurant.category = category;
      await this.restaurant.save(newRestaurant);
      return {
        ok: true,
        restaurantId: newRestaurant.id,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Could not create restaurant',
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    // console.log('for user', owner);
    try {
      const restaurant = await this.restaurant.findOne(
        editRestaurantInput.restaurantId,
      );
      // console.log('restro', restaurant);
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }

      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own",
        };
      }

      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        console.log('hi');
        category = await this.categories.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }
      console.log(
        editRestaurantInput.restaurantId,
        editRestaurantInput,
        category,
      );
      // always send id with save to update
      await this.restaurant.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);
      return {
        ok: true,
      };
    } catch (e) {
      console.log(e);
      return {
        ok: false,
        error: 'Could not edit Restaurant',
      };
    }
  }

  async deleteRestaurant(
    owner: User,
    { restaurantId }: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const restro = await this.restaurant.findOne(restaurantId);
      if (!restro) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== restro.ownerId) {
        return {
          ok: false,
          error: "You can't delete a restaurant that you don't own",
        };
      }
      await this.restaurant.delete(restaurantId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not delete restaurant.',
      };
    }
  }

  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurant.findAndCount({
        skip: (page - 1) * 3,
        take: 3,
      });
      return {
        ok: true,
        results: restaurants,
        totalPages: Math.ceil(totalResults / 3),
        totalResults,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load restaurants',
      };
    }
  }

  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restro = await this.restaurant.findOne(restaurantId, {
        relations: ['menu'],
      });
      if (!restro) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      return {
        ok: true,
        restaurant: restro,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not find restaurant',
      };
    }
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      // console.log(query);
      const [restaurants, totalResults] = await this.restaurant.findAndCount({
        where: {
          name: Raw((name) => `${name} LIKE '%${query}%'`),
        },
        skip: (page - 1) * 25,
        take: 25,
      });
      // console.log(restaurants);
      return {
        ok: true,
        restaurants,
        totalResults,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch (err) {
      console.log(err);
      return { ok: false, error: 'Could not search for restaurants' };
    }
  }

  // CATEGORIES HERE
  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }

  countRestaurants(category: Category) {
    return this.restaurant.count({ category });
  }

  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({ slug });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }
      const restaurants = await this.restaurant.find({
        where: {
          category,
        },
        // take 25 for every page
        take: 25,
        // pg 2- 25-50 ie skip first 25
        skip: (page - 1) * 25,
      });
      const totalResults = await this.countRestaurants(category);
      return {
        ok: true,
        restaurants,
        category,
        totalPages: Math.ceil(totalResults / 25),
      };
    } catch {
      return {
        ok: false,
        error: 'Could not load category',
      };
    }
  }

  // Dishes here
  async createDish(
    owner: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurant.findOne(
        createDishInput.restaurantId,
      );
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      await this.dishes.save(
        this.dishes.create({ ...createDishInput, restaurant }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Could not create dish',
      };
    }
  }

  async checkDishOwner(ownerId: number, dishId: number) {}

  async editDish(
    owner: User,
    editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    try {
      // load the restaurant relation.
      const dish = await this.dishes.findOne(editDishInput.dishId, {
        relations: ['restaurant'],
      });
      console.log(dish);
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found',
        };
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: 'You are not the restaurant Owner to do that.',
        };
      }
      await this.dishes.save([
        {
          id: editDishInput.dishId,
          ...editDishInput,
        },
      ]);
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        error: 'Could not delete dish',
      };
    }
  }

  async deleteDish(
    owner: User,
    { dishId }: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dishes.findOne(dishId, {
        relations: ['restaurant'],
      });
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found',
        };
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      await this.dishes.delete(dishId);
      return {
        ok: true,
      };
    } catch (err) {
      console.log(err);
      return {
        ok: false,
        error: 'Could not delete dish',
      };
    }
  }
}
