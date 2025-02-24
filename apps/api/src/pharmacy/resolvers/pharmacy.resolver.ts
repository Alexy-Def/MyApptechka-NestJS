import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { CreatePharmacyArgs, UpdatePharmacyInput } from '../dtos';
import { Pharmacy } from '../models';
import { PharmacyService } from '../services';

@Resolver(() => Pharmacy)
@UseInterceptors(ClassSerializerInterceptor)
export class PharmacyResolver {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Query(() => [Pharmacy])
  async getAllPharmacies(): Promise<Pharmacy[]> {
    return this.pharmacyService.getPharmacies();
  }

  @Query(() => Pharmacy)
  async getPharmacy(@Args('id', { type: () => Int }) id: number): Promise<Pharmacy> {
    return this.pharmacyService.getPharmacyByIdOrFail(id);
  }

  @Mutation(() => Pharmacy)
  async createPharmacy(@Args() data: CreatePharmacyArgs): Promise<Pharmacy> {
    return this.pharmacyService.createPharmacy(data);
  }

  @Mutation(() => Pharmacy)
  async updatePharmacy(@Args('id') id: number, @Args('data') data: UpdatePharmacyInput): Promise<Pharmacy> {
    return this.pharmacyService.updatePharmacy(id, data);
  }

  @Mutation(() => Boolean)
  async deletePharmacy(@Args('id') id: number): Promise<boolean> {
    return this.pharmacyService.deletePharmacy(id);
  }
}
