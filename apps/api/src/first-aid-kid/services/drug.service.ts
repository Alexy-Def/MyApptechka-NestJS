import { Injectable } from '@nestjs/common';

import { FirstAidKidService } from '@modules/first-aid-kid/services';

@Injectable()
export class DrugService {
  constructor(private readonly firstAidKidService: FirstAidKidService) {}

  // public async getMyFirstAidKids(userId: number): Promise<void> {}
}
