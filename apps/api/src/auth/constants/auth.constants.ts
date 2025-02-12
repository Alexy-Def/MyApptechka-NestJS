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
  AUTHORIZATION: 'Authorization',
};

export const SMS_TEMPLATE = {
  PRE_REGISTRATION:
    'Код подтверждения регистрации в приложении MyApptechka: {code}. Если Вы не отправляли запрос, проигнорируйте это сообщение.',
  FORGOT_PASSWORD:
    'Код подтверждения для восстановления пароля в приложении MyApptechka: {code}. Если Вы не отправляли запрос, никому не сообщейте код. Передача кода влечёт за собой получение злоумышленником доступа к аккаунту.',
};
