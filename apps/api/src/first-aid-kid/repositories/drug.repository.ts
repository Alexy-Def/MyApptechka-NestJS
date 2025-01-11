import { Repository } from 'typeorm';

import { CustomRepository } from '@libs/typeorm-ext';

import { DrugEntity } from '../entities';

@CustomRepository(DrugEntity)
export class DrugRepository extends Repository<DrugEntity> {}
