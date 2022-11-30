/* eslint-disable import/prefer-default-export */
import config from 'config';
import toast from 'react-hot-toast';
import { removeAccessToken } from './authFn';

export const revokeAccess = () => {
  removeAccessToken();
  window.location.href = config.AppDomain;
  window.location.reload();
};

export const handleUnAuthorization = (err: any) => {
  if (err.message === 'Unauthorized') {
    toast.error('Something went wrong');
    revokeAccess();
  }
};

interface IHandleError {
  error: any;
  explicitMessage?: string;
}

export const handleError = ({ error, explicitMessage }: IHandleError) => {
  if (error.message === 'Unauthorized') {
    toast.error('Unauthorized');
    revokeAccess();
  } else if (error.message === 'Server error') {
    console.log(error.message);
    if (explicitMessage) {
      toast.error(explicitMessage);
    } else {
      toast.error('Something went wrong');
    }
  } else {
    console.log(error.message);
    if (explicitMessage) {
      toast.error(explicitMessage);
    } else {
      toast.error(error.message);
    }
  }
};
