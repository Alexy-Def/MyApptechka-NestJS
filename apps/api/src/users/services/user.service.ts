import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { EntityNotFoundError } from '@modules/core/exceptions';

import { USER_ERRORS } from '../constants/errors';
import { UserRepository } from '../repositories';
import { UserDbDataById, UserDbDataByEmail, CreateUserData, UpdateUserData } from '../types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUserByIdOrFail(id: number, entityManager?: EntityManager): Promise<UserDbDataById> {
    const userRepository = entityManager ? entityManager.withRepository(this.userRepository) : this.userRepository;
    const user = await userRepository.findOneBy({ id });

    if (!user) {
      throw new EntityNotFoundError(USER_ERRORS.USER_NOT_FOUND);
    }

    return user;
  }

  public async getUser(email: string): Promise<UserDbDataByEmail | null> {
    return this.userRepository.findOneBy({ email });
  }

  public async createUser(user: CreateUserData, entityManager?: EntityManager): Promise<UserDbDataById> {
    const userRepository = entityManager ? entityManager.withRepository(this.userRepository) : this.userRepository;

    return userRepository.save(user);
  }

  public async updateUser(id: number, data: UpdateUserData, entityManager?: EntityManager): Promise<UserDbDataById> {
    const userRepository = entityManager ? entityManager.withRepository(this.userRepository) : this.userRepository;
    const user = await this.getUserByIdOrFail(id, entityManager);

    Object.assign(user, data);

    return userRepository.save(user);
  }

  public async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
    await this.userRepository.update({ id: userId }, { refreshToken });
  }

  public async unlockCustomerAccess(id: number): Promise<void> {
    await this.userRepository.update({ id }, { isBlocked: false });
  }
}
