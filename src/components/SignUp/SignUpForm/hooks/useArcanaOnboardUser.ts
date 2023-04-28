import { EthereumProvider } from '@arcana/auth';
import { useAuth, useProvider } from '@arcana/auth-react';
import { useMutation } from '@tanstack/react-query';
import { updateFirstTimeUser } from 'actions/auth';
import { updateUser } from 'actions/user';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, setAccessToken } from 'utils/authFn';
import { signArcanaMessage, signMessage } from 'utils/ethereumFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';
import { requestEthereumAccounts } from 'utils/web3EventFn';

interface ICreateProfile {
  userId: number | undefined;
  name: string;
  email: string;
  work?: string;
}

interface IVerifySignature {
  userId: number;
  message: string;
  walletId: string | undefined;
  isFirstTimeUser: boolean;
  signature: string | unknown;
}

const useArcanaOnboardUser = (setApiStep: Dispatch<SetStateAction<number>>) => {
  const auth = useAuth();

  const accessToken = getAccessToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createArcanaUser = useMutation(
    async () => {
      const payload = {
        walletId: auth.user?.address,
      };
      return fetch(`${config.ApiBaseUrl}/auth/sign-up/generate-nonce/arcana`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    },
    {
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: async res => {
        const body = await res.json();
        const signature = await signArcanaMessage(
          auth.provider,
          body.message,
          auth.user?.address
        );
        dispatch(updateUser(body.user));
        setApiStep(1);
        console.log('signature', signature);

        verifyArcanaSignature.mutate({
          userId: body.user.userId,
          message: body.message,
          walletId: auth.user?.address,
          isFirstTimeUser: body.isFirstTimeUser,
          signature,
        });
      },
    }
  );

  const verifyArcanaSignature = useMutation(
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

  return createArcanaUser;
};

export default useArcanaOnboardUser;
