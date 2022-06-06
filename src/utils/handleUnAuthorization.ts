/* eslint-disable import/prefer-default-export */
import config from 'config';
import { removeAccessToken } from './authFn';

export const handleUnAuthorization = (err: any) => {
  if (err.message === 'Unauthorized') {
    revokeAccess();
  }
};

export const revokeAccess = () => {
  removeAccessToken();
  window.location.href = config.AppDomain;
  window.location.reload();
};
