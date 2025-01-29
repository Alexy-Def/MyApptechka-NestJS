import { Injectable } from '@nestjs/common';

import { AidKitService } from '@modules/aid-kit/services';

@Injectable()
export class DrugService {
  constructor(private readonly aidKitService: AidKitService) {}

  // public async getMyAidKits(userId: number): Promise<void> {}
}
