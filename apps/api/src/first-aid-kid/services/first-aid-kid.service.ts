import { Injectable } from '@nestjs/common';

import { UserService } from '@modules/users/services';

@Injectable()
export class FirstAidKidService {
  constructor(private readonly userService: UserService) {}

  // public async getMyFirstAidKids(userId: number): Promise<void> {}
}
