import { updateCurrentStep, updateFirstTimeUser } from 'actions/auth';
import config from 'config';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { providers, ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleAddPolygonChain,
  signMessage,
  signArcanaMessage,
} from 'utils/ethereumFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { setAccessToken } from 'utils/authFn';
import { updateUser } from 'actions/user';
import { RootState } from 'reducers';
import {
  detectMetamask,
  handleSwitchChange,
  requestEthereumAccounts,
} from 'utils/web3EventFn';
import UAuth from '@uauth/js';
import { EthereumProvider } from '@arcana/auth';
import { useAuth } from '@arcana/auth-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getItem } from 'utils/localStorageFn';

interface IGenerateNonce {
  setError: Dispatch<SetStateAction<string>>;
}

const useMetamaskLogin = (
  setNewUserId?: React.Dispatch<React.SetStateAction<number>>
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const generateNonce = async ({ setError }: IGenerateNonce) => {
    const ac = new AbortController();
    const { signal } = ac;

    try {
      const provider = detectMetamask();
      const { errorMessage } = await handleSwitchChange(
        provider,
        config.chainId
      );
      if (errorMessage === 'Chain not present') {
        await handleAddPolygonChain(provider);
      }

      const account = await requestEthereumAccounts(provider);

      if (account) {
        const payload = {
          walletId: account,
        };

        const response = await fetch(
          `${config.ApiBaseUrl}/auth/generate-nonce`,
          {
            signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );

        const json: any = await handleApiErrors(response);

        dispatch(updateUser(json.user));

        const signature = await signMessage(provider, json.message);

        if (signature) {
          const payload2 = {
            message: json.message,
            walletId: account,
            isFirstTimeUser: json.isFirstTimeUser,
            signature,
          };

          const response2 = await fetch(
            `${config.ApiBaseUrl}/auth/verify-signature`,
            {
              signal,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload2),
            }
          );

          const json2: any = await handleApiErrors(response2);

          setAccessToken(json2.accessToken);
          dispatch(updateFirstTimeUser(json.isFirstTimeUser));
          dispatch(updateCurrentStep(2));
          if (setNewUserId) setNewUserId(json.user.userId);
          if (!getItem('orgData')) navigate('/dashboard');
        }
      }
    } catch (e: any) {
      if (e.message === 'Please install Metamask!') {
        setError(e.message);
      } else if (e.message === 'User rejected the request') {
        setError(e.message);
      } else if (e.message === 'Previous request already in progress') {
        setError(e.message);
      }
    }
  };

  return generateNonce;
};

const useWalletConnectLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const walletConnectProvider = useSelector(
    (state: RootState) => state.app.walletConnectProvider
  );

  const walletConnectGenerateNonce = async ({ setError }: IGenerateNonce) => {
    const ac = new AbortController();
    const { signal } = ac;

    try {
      await walletConnectProvider.enable();
      const web3Provider = new providers.Web3Provider(walletConnectProvider);

      const accounts = await web3Provider.listAccounts();

      const { chainId } = await web3Provider.getNetwork();
      console.log(chainId);
      await walletConnectProvider.disconnect();
      console.log(accounts);

      // TODO - Use testnet and mainnet chain ID check
      if (chainId !== 137) {
        throw new Error('Please change the network to Polygon');
      }

      if (accounts.length > 0) {
        const payload = {
          walletId: accounts[0],
        };

        const response = await fetch(
          `${config.ApiBaseUrl}/auth/generate-nonce`,
          {
            signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );

        const json: any = await handleApiErrors(response);

        dispatch(updateUser(json.user));

        const signature = await signMessage(
          walletConnectProvider,
          json.message
        );

        if (signature) {
          const payload2 = {
            message: json.message,
            walletId: accounts[0],
            isFirstTimeUser: json.isFirstTimeUser,
            signature,
          };

          const response2 = await fetch(
            `${config.ApiBaseUrl}/auth/verify-signature`,
            {
              signal,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload2),
            }
          );

          const json2: any = await handleApiErrors(response2);
          dispatch(updateUser(json2.user));
          setAccessToken(json2.accessToken);
          dispatch(updateFirstTimeUser(json.isFirstTimeUser));
          dispatch(updateCurrentStep(2));
          navigate('/dashboard');
        }
      }
    } catch (e: any) {
      if (e.message === 'Please install Metamask!') {
        setError(e.message);
      } else if (e.message === 'User rejected the request') {
        setError(e.message);
      } else if (e.message === 'Previous request already in progress') {
        setError(e.message);
      } else if (e.message === 'Please change the network to Polygon') {
        setError(e.message);
      }
    }
  };

  return walletConnectGenerateNonce;
};

const useUnstoppableDomains = () => {
  const ac = new AbortController();
  const { signal } = ac;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uauth = new UAuth({
    clientID: import.meta.env.VITE_UD_CLIENT_KEY,
    redirectUri: config.AppDomain,
    scope: 'openid wallet profile:optional',
  });

  const login = async () => {
    try {
      const authorization = await uauth.loginWithPopup();
      if (
        authorization &&
        authorization.idToken &&
        authorization.idToken.wallet_address
      ) {
        const response = await fetch(
          `${config.ApiBaseUrl}/auth/verify-ud-signature`,
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
        const json: any = await handleApiErrors(response);
        dispatch(updateUser(json.user));
        setAccessToken(json.accessToken);
        dispatch(updateFirstTimeUser(json.isFirstTimeUser));
        dispatch(updateCurrentStep(2));
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await uauth.logout();
      console.log('Logged out with Unstoppable');
    } catch (error) {
      console.error(error);
    }
  };
  return { login, logout };
};

const useArcanaWallet = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const ac = new AbortController();
  const { signal } = ac;
  const dispatch = useDispatch();

  const loginSuccess = async (
    walletId: string | undefined,
    provider: EthereumProvider
  ) => {
    if (walletId) {
      const payload = {
        walletId,
      };

      const response = await fetch(
        `${config.ApiBaseUrl}/auth/generate-nonce/arcana`,
        {
          signal,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const json: any = await handleApiErrors(response);

      dispatch(updateUser(json.user));

      const signature = await signArcanaMessage(
        provider,
        json.message,
        walletId
      );

      if (signature) {
        const payload2 = {
          message: json.message,
          walletId,
          isFirstTimeUser: json.isFirstTimeUser,
          signature,
        };

        const response2 = await fetch(
          `${config.ApiBaseUrl}/auth/verify-signature`,
          {
            signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload2),
          }
        );

        const json2: any = await handleApiErrors(response2);

        setAccessToken(json2.accessToken);
        dispatch(updateFirstTimeUser(json.isFirstTimeUser));

        if (auth.isLoggedIn && !getItem('orgData')) navigate('/dashboard'); // builder login
      }
    }
  };
  return { loginSuccess };
};

export {
  useMetamaskLogin,
  useWalletConnectLogin,
  useUnstoppableDomains,
  useArcanaWallet,
};
