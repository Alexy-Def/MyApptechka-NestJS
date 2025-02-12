import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { generateRandomSixDigits } from '@libs/helpers';
import { EntityNotFoundError } from '@modules/core/exceptions';

import { FAMILY_ERRORS } from '../constants/errors';
import { FamilyRepository } from '../repositories';
import { FamilyDbData, CreateFamilyData, UpdateFamilyData } from '../types';

@Injectable()
export class FamilyService {
  constructor(private readonly familyRepository: FamilyRepository) {}

  public async getFamilyByIdOrFail(id: number, entityManager?: EntityManager): Promise<FamilyDbData> {
    const familyRepository = entityManager
      ? entityManager.withRepository(this.familyRepository)
      : this.familyRepository;
    const family = await familyRepository.findOneBy({ id });

    if (!family) {
      throw new EntityNotFoundError(FAMILY_ERRORS.FAMILY_NOT_FOUND);
    }

    return family;
  }

  public async getFamilyByReferralCodeAndTitleOrFail(
    params: {
      referralCode?: number;
      title?: string;
    },
    entityManager?: EntityManager,
  ): Promise<FamilyDbData> {
    const familyRepository = entityManager
      ? entityManager.withRepository(this.familyRepository)
      : this.familyRepository;

    const family = await familyRepository.findOneBy({ ...params });

    if (!family) {
      throw new EntityNotFoundError(FAMILY_ERRORS.FAMILY_NOT_FOUND);
    }

    return family;
  }

  public async getOrCreateFamily(data: CreateFamilyData, entityManager?: EntityManager): Promise<FamilyDbData> {
    const familyRepository = entityManager
      ? entityManager.withRepository(this.familyRepository)
      : this.familyRepository;

    if (data.referralCode) {
      const family = await this.getFamilyByReferralCodeAndTitleOrFail(
        { referralCode: data.referralCode, title: data.title },
        entityManager,
      );
      // check availability to add user (user count restriction)

      return family;
    }

    data.referralCode = generateRandomSixDigits();

    return familyRepository.save(data);
  }

  public async updateFamily(id: number, data: UpdateFamilyData, entityManager?: EntityManager): Promise<FamilyDbData> {
    const familyRepository = entityManager
      ? entityManager.withRepository(this.familyRepository)
      : this.familyRepository;
    const family = await this.getFamilyByIdOrFail(id, entityManager);

    Object.assign(family, data);

    return familyRepository.save(family);
  }
}
