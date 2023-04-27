import { useMutation } from '@tanstack/react-query';
import { updateFirstTimeUser } from 'actions/auth';
import { updateUser } from 'actions/user';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import { getAccessToken, setAccessToken } from 'utils/authFn';
import { signMessage } from 'utils/ethereumFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import { detectMetamask, requestEthereumAccounts } from 'utils/web3EventFn';

interface ICreateProfile {
  userId: number | undefined;
  name: string;
  email: string;
  work?: string;
}

interface IVerifySignature {
  userId: number;
  message: string;
  walletId: string;
  isFirstTimeUser: boolean;
  signature: string | null;
}

const useOnboardMetamaskUser = (
  setApiStep: Dispatch<SetStateAction<number>>
) => {
  const accessToken = getAccessToken();
  const dispatch = useDispatch();
  const provider = detectMetamask();

  const getAccount = async () => {
    const account = await requestEthereumAccounts(provider);
    return account;
  };

  const createUser = useMutation(
    async () => {
      const account = await getAccount();
      const payload = {
        walletId: account,
      };
      return fetch(`${config.ApiBaseUrl}/auth/generate-nonce/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: async res => {
        const body = await res.json();
        const signature = await signMessage(provider, body.message);
        const account = await getAccount();

        dispatch(updateUser(body.user));
        setApiStep(1);

        verifySignature.mutate({
          userId: body.user.userId,
          message: body.message,
          walletId: account,
          isFirstTimeUser: body.isFirstTimeUser,
          signature,
        });
      },
    }
  );

  const verifySignature = useMutation(
    async (payload: IVerifySignature) => {
      return fetch(`${config.ApiBaseUrl}/auth/verify-signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: async res => {
        const body = await res.json();
        setAccessToken(body.accessToken);
        dispatch(updateFirstTimeUser(body.isFirstTimeUser));
        setApiStep(2);
      },
    }
  );

  const updateProfile = useMutation(
    (payload: ICreateProfile) => {
      return fetch(`${config.ApiBaseUrl}/user/first-time/${payload.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: async res => {
        setApiStep(3);
      },
    }
  );

  const saveUserOnboardData = useMutation(
    async (data: any) => {
      const objectives = data[0]?.map(function (item: any) {
        return item.choice;
      });
      if (objectives) {
        const response = await fetch(
          `${config.ApiBaseUrl}/user/signup-objective`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: data[3]?.userId,
              objectives,
            }),
          }
        );
        await handleApiErrors(response);
      }
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return {
    createUser,
    updateProfile,
    saveUserOnboardData,
  };
};

export default useOnboardMetamaskUser;
