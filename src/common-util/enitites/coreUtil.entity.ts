import { Field, ObjectType } from '@nestjs/graphql';
import { number } from 'joi';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class CoreUtil {
  @PrimaryGeneratedColumn()
  @Field((type) => number)
  id: number;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field((type) => Date)
  updatedAt: Date;
}
