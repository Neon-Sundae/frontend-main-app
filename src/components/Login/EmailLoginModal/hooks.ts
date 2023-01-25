import { useQuery } from '@tanstack/react-query';
import config from 'config';
import {
  handleError,
  handleUnAuthorization,
} from 'utils/handleUnAuthorization';
import { handleApiErrors } from 'utils/handleApiErrors';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from 'actions/user';
import { updateCurrentStep, updateFirstTimeUser } from 'actions/auth';
import { getAccessToken, setAccessToken } from 'utils/authFn';
import { RootState } from 'reducers';
import { useNavigate } from 'react-router-dom';

const useOtpLogin = (email: string | null) => {
  const { data, refetch } = useQuery(
    ['otp_login'],
    async () => {
      const response = await fetch(`${config.ApiBaseUrl}/auth/otp-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const json = await handleApiErrors(response);
      console.log('json', json);
      return json;
    },
    {
      enabled: false,
      retry: 0,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: data,
        });
      },
    }
  );

  return { data, refetch };
};

const useVerifyOtp = (email: string, otp: string) => {
  const dispatch = useDispatch();

  const { data, refetch } = useQuery(
    ['verify_otp'],
    async () => {
      const response = await fetch(`${config.ApiBaseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const json = await handleApiErrors(response);
      console.log('json', json);
      setAccessToken(json.accessToken);
      dispatch(updateFirstTimeUser(json.isFirstTimeUser));
      dispatch(updateUser(json.user));
      dispatch(updateCurrentStep(2));
      return json;
    },
    {
      enabled: false,
      refetchOnWindowFocus: false,
      retry: 0,
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: data,
        });
      },
    }
  );

  return { refetch };
};

export { useOtpLogin, useVerifyOtp };
