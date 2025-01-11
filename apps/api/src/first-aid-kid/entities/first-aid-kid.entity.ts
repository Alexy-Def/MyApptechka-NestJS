import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';
import { DrugEntity } from '@modules/first-aid-kid/entities';

@Entity({ name: 'first_aid_kid' })
export class FirstAidKidEntity extends BaseEntity {
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

  @OneToMany(() => DrugEntity, (drug) => drug.firstAidKid)
  public drugs?: DrugEntity[];

  //   @Column()
  //   public userId: number;

  //   @ManyToOne(() => UserEntity, (user) => user.firstAidKid)
  //   public user?: UserEntity;
}
