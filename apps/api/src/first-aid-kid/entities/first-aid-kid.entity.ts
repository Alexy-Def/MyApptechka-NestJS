import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';

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

  //   @Column()
  //   public userId: number;

  //   @ManyToOne(() => UserEntity, (user) => user.firstAidKid)
  //   public user?: UserEntity;
}
