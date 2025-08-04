import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';

@Entity({ name: 'pharmacy' })
export class PharmacyEntity extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public address: string;

  @Column()
  public startWorkAt: string;

  @Column()
  public endWorkAt: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  public slogan: string | null;
}
