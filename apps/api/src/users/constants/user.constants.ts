export const USER_DEFAULT_VALUES = {
  MAX_RATING: 5,
  RATING_INCREMENT_STEP: 0.1,
};

export enum USER_ROLE {
  USER = 'user',
  ADMIN = 'admin',
}

export const ROLE_CONSTANTS = {
  KEY: 'roles',
};

export enum RATING_CALCULATION_OPERATORS {
  ADDITION = 'addition',
  SUBTRACTION = 'subtraction',
}
