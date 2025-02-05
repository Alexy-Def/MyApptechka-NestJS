/* eslint-disable no-magic-numbers */
export function generateRandomSixDigits(): number {
  const timestampPart = Date.now() % 1000;
  const randomPart = Math.floor(100 + Math.random() * 900);
  const code = timestampPart * 1000 + randomPart;

  return code < 100000 ? code + 100000 : code;
}
