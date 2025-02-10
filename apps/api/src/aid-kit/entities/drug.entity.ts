import { Column, Entity, ManyToOne } from 'typeorm';

import { AidKitEntity } from '@modules/aid-kit/entities';
import { BaseEntity } from '@modules/core/entities';

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
  public aidKitId: number;

  @ManyToOne(() => AidKitEntity, (aidKit) => aidKit.drugs)
  public aidKit?: AidKitEntity;
}
