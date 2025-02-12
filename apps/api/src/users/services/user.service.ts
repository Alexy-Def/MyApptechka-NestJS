import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import { hashPassword, compareHashedPassword } from '@libs/helpers';
import { EntityNotFoundError, ServiceError } from '@modules/core/exceptions';
import { AUTH } from 'config';

import { USER_ERRORS } from '../constants/errors';
import { UserRepository } from '../repositories';
import { UserDbData, UserByPhoneDbData, CreateUserData, UpdateUserData, ChangePasswordData } from '../types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly dataSource: DataSource) {}

  public async getUserByIdOrFail(id: number, entityManager?: EntityManager): Promise<UserDbData> {
    const userRepository = entityManager ? entityManager.withRepository(this.userRepository) : this.userRepository;
    const user = await userRepository.findOneBy({ id });

    if (!user) {
      throw new EntityNotFoundError(USER_ERRORS.USER_NOT_FOUND);
    }

    return user;
  }

  public async getUserByPhone(phone: string, entityManager?: EntityManager): Promise<UserByPhoneDbData | null> {
    const userRepository = entityManager ? entityManager.withRepository(this.userRepository) : this.userRepository;
    const user = await userRepository.findOneBy({ phone });

    return user;
  }

  public async changePassword(body: ChangePasswordData, checkOldPassword: boolean): Promise<void> {
    const { phone, newPassword, confirmNewPassword, oldPassword } = body;

    if (newPassword !== confirmNewPassword) {
      throw new ServiceError(USER_ERRORS.INVALID_CONFIRM_PASSWORD);
    }

    await this.dataSource.manager.transaction(async (entityManager) => {
      const userRepository = entityManager.withRepository(this.userRepository);
      const user = await this.getUserByPhone(phone);

      if (checkOldPassword && oldPassword) {
        const matchedOldPassword = await compareHashedPassword(oldPassword, user?.password!);

        if (!matchedOldPassword) {
          throw new ServiceError(USER_ERRORS.INVALID_OLD_PASSWORD);
        }
      }

      const hashedPassword = await hashPassword(newPassword, AUTH.PASSWORD_HASH_SALT_ROUNDS);
      await userRepository.update({ id: user?.id }, { password: hashedPassword });
    });
  }

  public async createUser(user: CreateUserData, entityManager?: EntityManager): Promise<UserDbData> {
    const userRepository = entityManager ? entityManager.withRepository(this.userRepository) : this.userRepository;

    return userRepository.save(user);
  }

  public async updateUser(id: number, data: UpdateUserData, entityManager?: EntityManager): Promise<UserDbData> {
    const userRepository = entityManager ? entityManager.withRepository(this.userRepository) : this.userRepository;
    const user = await this.getUserByIdOrFail(id, entityManager);

    Object.assign(user, data);

    return userRepository.save(user);
  }

  public async unlockCustomerAccess(id: number): Promise<void> {
    await this.userRepository.update({ id }, { isBlocked: false });
  }
}
