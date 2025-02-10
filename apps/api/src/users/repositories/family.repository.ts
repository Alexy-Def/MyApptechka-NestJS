import { Repository } from 'typeorm';

import { CustomRepository } from '@libs/typeorm-ext';

import { FamilyEntity } from '../entities';

@CustomRepository(FamilyEntity)
export class FamilyRepository extends Repository<FamilyEntity> {}
