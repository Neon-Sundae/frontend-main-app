/* eslint-disable prefer-spread */
const getRandomString = (length: number): string => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.apply(null, Array(length))
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('');
};

export default getRandomString;
