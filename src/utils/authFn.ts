import { getItem, removeItem, setItem } from './localStorageFn';

export const getAccessToken = () => getItem('access_token');

export const setAccessToken = (accessToken: string) =>
  setItem('access_token', accessToken);

export const removeAccessToken = () => removeItem('access_token');
