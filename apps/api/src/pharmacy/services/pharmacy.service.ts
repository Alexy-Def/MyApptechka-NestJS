import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';

import { PHARMACY_ERRORS } from '../constants';
import { CreatePharmacyArgs, UpdatePharmacyInput } from '../dtos';
import { PharmacyModel } from '../models';
import { PharmacyRepository } from '../repositories';

@Injectable()
export class PharmacyService {
  constructor(private readonly pharmacyRepository: PharmacyRepository) {}

  public async getPharmacies(): Promise<PharmacyModel[]> {
    return this.pharmacyRepository.find();
  }

  public async getPharmacyByIdOrFail(id: number): Promise<PharmacyModel | undefined> {
    const pharmacy = await this.pharmacyRepository.findOneBy({ id });

    if (!pharmacy) {
      throw new GraphQLError(PHARMACY_ERRORS.PHARMACY_NOT_FOUND);
    }

    return pharmacy;
  }

  public async createPharmacy(data: CreatePharmacyArgs): Promise<PharmacyModel> {
    return this.pharmacyRepository.save(data);
  }

  public async updatePharmacy(id: number, data: UpdatePharmacyInput): Promise<PharmacyModel> {
    const pharmacy = await this.getPharmacyByIdOrFail(id);

    Object.assign(pharmacy!, data);

    return this.pharmacyRepository.save(pharmacy!);
  }

  public async deletePharmacy(id: number): Promise<boolean> {
    await this.pharmacyRepository.delete(id);

    return true;
  }
}
