import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';
import { FirstAidKidEntity } from '@modules/first-aid-kid/entities';

@Entity({ name: 'drug' })
export class DrugEntity extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public dosageForm: string;

  @Column()
  public dosageFormType: string;

  @Column()
  public purpose: string;

  @Column()
  public residue: number;

  @Column()
  public expirationDate: Date;

  @Column()
  public userId: number;

  @ManyToOne(() => FirstAidKidEntity, (firstAidKid) => firstAidKid.drugs)
  public firstAidKid?: FirstAidKidEntity;
}
