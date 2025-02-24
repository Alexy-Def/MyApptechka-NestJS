import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class UpdatePharmacyInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(10)
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  startWorkAt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  endWorkAt?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slogan?: string;
}
