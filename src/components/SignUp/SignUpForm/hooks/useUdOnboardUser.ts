import { useMutation } from '@tanstack/react-query';
import { updateFirstTimeUser } from 'actions/auth';
import { updateUser } from 'actions/user';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';
import { getAccessToken, setAccessToken } from 'utils/authFn';
import { signMessage } from 'utils/ethereumFn';
import { handleError } from 'utils/handleUnAuthorization';
import { detectMetamask, requestEthereumAccounts } from 'utils/web3EventFn';
import UAuth from '@uauth/js';

interface IVerifySignature {
  userId: number;
  message: string;
  walletId: string;
  isFirstTimeUser: boolean;
  signature: string | null;
}

const useUdOnboardUser = (setApiStep: Dispatch<SetStateAction<number>>) => {
  const accessToken = getAccessToken();
  const dispatch = useDispatch();
  const provider = detectMetamask();
  const ac = new AbortController();
  const { signal } = ac;

  const uauth = new UAuth({
    clientID: import.meta.env.VITE_UD_CLIENT_KEY,
    redirectUri: config.AppDomain,
    scope: 'openid wallet profile:optional',
  });

  const getAccount = async () => {
    const account = await requestEthereumAccounts(provider);
    return account;
  };

  const createUser = useMutation(async () => {
    const authorization = await uauth.loginWithPopup();
    if (
      authorization &&
      authorization.idToken &&
      authorization.idToken.wallet_address
    ) {
      const response = await fetch(
        `${config.ApiBaseUrl}/auth/verify-ud-signature/sign-up`,
        {
          signal,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletId: authorization.idToken.wallet_address,
            signature: authorization.idToken.eip4361_signature,
            message: authorization.idToken.eip4361_message,
            nonce: authorization.idToken.nonce,
            domain: authorization.idToken.sub,
            picture: authorization.idToken.picture,
          }),
        }
      );

      const body = await response.json();
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
    }
  });

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
        dispatch(updateFirstTimeUser(true));
        setApiStep(2);
      },
    }
  );

  return createUser;
};

export default useUdOnboardUser;
