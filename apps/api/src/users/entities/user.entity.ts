import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';

import { USER_ROLE } from '../constants';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column()
  public username: string;

  @Column({ type: 'enum', enum: USER_ROLE })
  public role: USER_ROLE;

  @Column({ type: 'varchar', nullable: true, default: null })
  public refreshToken: string | null;

  @Column({ type: 'boolean', default: false })
  public isBlocked: boolean;
}
