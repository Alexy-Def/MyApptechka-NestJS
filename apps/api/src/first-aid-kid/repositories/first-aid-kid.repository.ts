import { Repository } from 'typeorm';

import { CustomRepository } from '@libs/typeorm-ext';

import { FirstAidKidEntity } from '../entities';

@CustomRepository(FirstAidKidEntity)
export class FirstAidKidRepository extends Repository<FirstAidKidEntity> {}
