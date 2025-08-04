export type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error';

export type LogObject = {
  body: object;
  user: RequestUser;
  originalUrl: string;
  query: object;
  params: object;
  method: string;
};

type RequestUser = {
  id: number;
};
