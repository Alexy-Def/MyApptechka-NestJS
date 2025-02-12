export const AUTH_CONSTANTS = {
  IS_PUBLIC_KEY: 'isPublic',
  PASSWORD_HASH_SALT_ROUNDS: 10,
  PASSWORD_REGEX:
    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[a-zA-Z]){8,})(?=.*\d)(?=.*[!@#$%^&*()_+=])[A-Za-z\d!@#$%^&*()_+=]{10,}$/,
};

export const AUTH_HEADERS = {
  DEVICE_NAME: 'device-name',
  DEVICE_NAME_DESCRIPTION: 'If a mobile device -> send device name and OS',
  USER_AGENT: 'user-agent',
  AUTHORIZATION: 'authorization',
};
