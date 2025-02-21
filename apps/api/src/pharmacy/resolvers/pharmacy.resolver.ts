import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { CreatePharmacyArgs, UpdatePharmacyInput } from '../dtos';
import { PharmacyModel } from '../models';
import { PharmacyService } from '../services';

@Resolver(() => PharmacyModel)
export class PharmacyResolver {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Query(() => [PharmacyModel])
  async getAllPharmacies(): Promise<PharmacyModel[]> {
    return this.pharmacyService.getPharmacies();
  }

  @Query(() => PharmacyModel)
  async getPharmacy(@Args('id') id: number): Promise<PharmacyModel | undefined> {
    return this.pharmacyService.getPharmacyByIdOrFail(id);
  }

  @Mutation(() => PharmacyModel)
  async createPharmacy(@Args() data: CreatePharmacyArgs): Promise<PharmacyModel> {
    return this.pharmacyService.createPharmacy(data);
  }

  @Mutation(() => PharmacyModel)
  async updatePharmacy(@Args('id') id: number, @Args('data') data: UpdatePharmacyInput): Promise<PharmacyModel> {
    return this.pharmacyService.updatePharmacy(id, data);
  }

  @Mutation(() => Boolean)
  async deletePharmacy(@Args('id') id: number): Promise<boolean> {
    return this.pharmacyService.deletePharmacy(id);
  }
}
