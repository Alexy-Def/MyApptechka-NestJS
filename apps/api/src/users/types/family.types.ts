import { FamilyEntity } from '../entities';

export type FamilyDbData = {
  id: number;
  title: string;
  referralCode: number;
  headOfId?: number | null;
};

export type CreateFamilyData = {
  title: string;
  referralCode?: number;
};

export type UpdateFamilyData = Partial<Pick<FamilyEntity, 'title' | 'headOfId'>>;
