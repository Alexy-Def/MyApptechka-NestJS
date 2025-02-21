import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PharmacyModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  startWorkAt: Date;

  @Field()
  endWorkAt: Date;

  @Field(() => String, { nullable: true })
  slogan?: string | null;
}
