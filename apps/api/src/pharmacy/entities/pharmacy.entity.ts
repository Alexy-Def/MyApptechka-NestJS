import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@modules/core/entities';

@Entity({ name: 'pharmacy' })
export class PharmacyEntity extends BaseEntity {
  @Column()
  public name: string;

  @Column()
  public address: string;

  @Column()
  public startWorkAt: Date;

  @Column()
  public endWorkAt: Date;

  @Column({ type: 'varchar', nullable: true, default: null })
  public slogan: string | null;
}
