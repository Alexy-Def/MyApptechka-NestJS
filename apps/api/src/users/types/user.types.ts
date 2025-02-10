import { USER_ROLE } from '../constants';

export type UserDbData = {
  id: number;
  username: string;
  password: string;
  role: USER_ROLE;
  refreshToken: string | null;
  familyId?: number | null;
};

export type UserByPhoneDbData = UserDbData;

export type CreateUserData = Omit<UserDbData, 'id' | 'refreshToken'>;
export type UpdateUserData = Partial<CreateUserData>;

export type ChangePasswordData = {
  phone: string;
  newPassword: string;
  confirmNewPassword: string;
  oldPassword?: string;
};
