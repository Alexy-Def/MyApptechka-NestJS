import { Field, ArgsType } from '@nestjs/graphql';
import { IsOptional, IsString, MinLength } from 'class-validator';

@ArgsType()
export class CreatePharmacyArgs {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  @MinLength(10)
  address: string;

  @Field()
  @IsString()
  startWorkAt: string;

  @Field()
  @IsString()
  endWorkAt: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slogan?: string;
}
