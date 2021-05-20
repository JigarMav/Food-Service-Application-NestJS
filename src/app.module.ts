import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
const Joi = require('joi');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'food-delivery',
      entities: [Restaurant],
      synchronize: true,
      logging: true,
    }),

    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
