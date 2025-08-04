import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';

import { PHARMACY_ERRORS } from '../constants';
import { CreatePharmacyArgs, UpdatePharmacyInput } from '../dtos';
import { Pharmacy } from '../models';
import { PharmacyRepository } from '../repositories';

@Injectable()
export class PharmacyService {
  constructor(private readonly pharmacyRepository: PharmacyRepository) {}

  public async getPharmacies(): Promise<Pharmacy[]> {
    return this.pharmacyRepository.find();
  }

  public async getPharmacyByIdOrFail(id: number): Promise<Pharmacy> {
    const pharmacy = await this.pharmacyRepository.findOneBy({ id });

    if (!pharmacy) {
      throw new GraphQLError(PHARMACY_ERRORS.PHARMACY_NOT_FOUND);
    }

    return pharmacy;
  }

  public async createPharmacy(data: CreatePharmacyArgs): Promise<Pharmacy> {
    return this.pharmacyRepository.save(data);
  }

  public async updatePharmacy(id: number, data: UpdatePharmacyInput): Promise<Pharmacy> {
    const pharmacy = await this.getPharmacyByIdOrFail(id);

    Object.assign(pharmacy, data);

    return this.pharmacyRepository.save(pharmacy!);
  }

  public async deletePharmacy(id: number): Promise<boolean> {
    const result = await this.pharmacyRepository.delete(id);

    return typeof result.affected === 'number' && result.affected > 0;
  }
}
