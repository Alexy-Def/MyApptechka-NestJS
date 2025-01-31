import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { EntityNotFoundError } from '@modules/core/exceptions';

import { USER_ERRORS } from '../constants/errors';
import { FamilyRepository } from '../repositories';
import { FamilyDbData, CreateFamilyData } from '../types';

@Injectable()
export class FamilyService {
  constructor(private readonly familyRepository: FamilyRepository) {}

  public async getFamilyByIdOrFail(id: number, entityManager?: EntityManager): Promise<FamilyDbData> {
    const familyRepository = entityManager
      ? entityManager.withRepository(this.familyRepository)
      : this.familyRepository;
    const family = await familyRepository.findOneBy({ id });

    if (!family) {
      throw new EntityNotFoundError(USER_ERRORS.USER_NOT_FOUND);
    }

    return family;
  }

  // public async getUser(email: string): Promise<UserDbDataByEmail | null> {
  //   return this.userRepository.findOneBy({ email });
  // }

  public async createFamily(family: CreateFamilyData, entityManager?: EntityManager): Promise<FamilyDbData> {
    const familyRepository = entityManager
      ? entityManager.withRepository(this.familyRepository)
      : this.familyRepository;

    return familyRepository.save(family);
  }
}
