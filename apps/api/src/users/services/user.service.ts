import { Injectable } from '@nestjs/common';

import { EntityNotFoundError } from '@modules/core/exceptions';

import { USER_ERRORS } from '../constants/errors';
import { UserRepository } from '../repositories';
import { UserDbDataById, UserDbDataByEmail, CreateUserData } from '../types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUserByIdOrFail(id: number, userRepositoryTransaction?: UserRepository): Promise<UserDbDataById> {
    const userRepository = userRepositoryTransaction ? userRepositoryTransaction : this.userRepository;
    const user = await userRepository.findOneBy({ id });

    if (!user) {
      throw new EntityNotFoundError(USER_ERRORS.USER_NOT_FOUND);
    }

    return user;
  }

  public async toggleIsBlockedStatus(
    userId: number,
    isBlocked: boolean,
    userRepository: UserRepository,
  ): Promise<void> {
    await userRepository.update({ id: userId }, { isBlocked });
  }

  public async getUser(email: string): Promise<UserDbDataByEmail | null> {
    return this.userRepository.findOneBy({ email });
  }

  public async createUser(user: CreateUserData): Promise<void> {
    await this.userRepository.save(user);
  }

  public async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.userRepository.update({ id: userId }, { refreshToken });
  }

  public async unlockCustomerAccess(id: number): Promise<void> {
    await this.userRepository.update({ id }, { isBlocked: false });
  }
}
