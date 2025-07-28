import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Expose } from 'class-transformer';

@ObjectType()
export class Pharmacy {
  @Field(() => Int)
  @Expose()
  id: number;

  @Field()
  @Expose()
  createdAt: Date;

  @Field()
  @Expose()
  updatedAt: Date;

  @Field()
  @Expose()
  name: string;

  @Field()
  @Expose()
  address: string;

  @Field()
  @Expose()
  startWorkAt: string;

  @Field()
  @Expose()
  endWorkAt: string;

  @Field(() => String, { nullable: true })
  @Expose()
  slogan: string | null = null;
}
