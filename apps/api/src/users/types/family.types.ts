// import { USER_ROLE } from '../constants';

export type FamilyDbData = {
  id: number;
  title: string;
  referralCode: number;
  headOfId?: number | null;
};

export type CreateFamilyData = {
  title: string;
  referralCode: number;
};

// export type UserDbDataById = {
//   id: number;
//   email: string;
//   username: string;
//   role: USER_ROLE;
//   refreshToken: string | null;
// };

// export type UserDbDataByEmail = UserDbDataById & {
//   password: string;
// };

// export type CreateUserData = Omit<UserDbDataByEmail, 'id' | 'refreshToken'>;
