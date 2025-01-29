import { Column, Entity, OneToMany } from 'typeorm';

import { DrugEntity } from '@modules/aid-kit/entities';
import { BaseEntity } from '@modules/core/entities';

@Entity({ name: 'aid_kit' })
export class AidKitEntity extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public place: string;

  @Column()
  public color: string;

  @Column()
  public imageUrl: string;

  @OneToMany(() => DrugEntity, (drug) => drug.aidKit)
  public drugs?: DrugEntity[];

  //   @Column()
  //   public userId: number;

  //   @ManyToOne(() => UserEntity, (user) => user.firstAidKid)
  //   public user?: UserEntity;
}
