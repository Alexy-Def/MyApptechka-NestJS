import { InputType, Field } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class UpdatePharmacyInput {
  @Field()
  name?: string;

  @Field()
  @MinLength(10)
  address?: string;

  @Field()
  startWorkAt?: Date;

  @Field()
  endWorkAt?: Date;

  @Field({ nullable: true })
  slogan?: string;
}
