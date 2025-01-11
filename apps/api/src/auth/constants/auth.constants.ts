export const AUTH_CONSTANTS = {
  IS_PUBLIC_KEY: 'isPublic',
  PASSWORD_HASH_SALT_ROUNDS: 10,
  PASSWORD_REGEX:
    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[a-zA-Z]){8,})(?=.*\d)(?=.*[!@#$%^&*()_+=])[A-Za-z\d!@#$%^&*()_+=]{10,}$/,
};
