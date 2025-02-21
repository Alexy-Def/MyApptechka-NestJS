import { Field, ArgsType } from '@nestjs/graphql';
import { IsDateString, MinLength } from 'class-validator';

@ArgsType()
export class CreatePharmacyArgs {
  @Field()
  name: string;

  @Field()
  @MinLength(10)
  address: string;

  @Field()
  @IsDateString()
  startWorkAt: Date;

  @Field()
  @IsDateString()
  endWorkAt: Date;

  @Field()
  slogan?: string;
}
