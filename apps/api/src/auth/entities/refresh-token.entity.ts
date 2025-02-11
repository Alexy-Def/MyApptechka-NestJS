import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';
import { UserEntity } from '@modules/users/entities';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity extends BaseEntity {
  @Column({ default: true })
  public isActive: boolean;

  @Column()
  public expirationDate: Date;

  @Column({ type: 'varchar', nullable: true, default: null })
  public device: string | null;

  @Column()
  public userId: number;

  @Column()
  public token: string;

  @ManyToOne(() => UserEntity)
  public user?: UserEntity;
}
