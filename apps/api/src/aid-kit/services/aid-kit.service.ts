import { Injectable } from '@nestjs/common';

import { UserService } from '@modules/users/services';

@Injectable()
export class AidKitService {
  constructor(private readonly userService: UserService) {}

  // public async getMyAidKits(userId: number): Promise<void> {}
}
