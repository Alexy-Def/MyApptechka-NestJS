import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';
import { UserEntity } from '@modules/users';

@Entity({ name: 'family' })
export class FamilyEntity extends BaseEntity {
  @Column()
  public title: string;

  @Column()
  public referralCode: number;

  @Column({ nullable: true })
  public headOfId: number | null;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  public headOf: UserEntity;

  @OneToMany(() => UserEntity, (user) => user.family)
  public users?: UserEntity[];
}
