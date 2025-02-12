import { FamilyEntity } from '../entities';

export type CreateFamilyData = {
  title: string;
  referralCode?: number;
};

export type FamilyDbData = FamilyEntity;
export type UpdateFamilyData = Partial<Pick<FamilyEntity, 'title' | 'headOfId'>>;
