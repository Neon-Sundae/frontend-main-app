import { updateCurrentStep, updateFirstTimeUser } from 'actions/auth';
import config from 'config';
import { Dispatch, SetStateAction } from 'react';
import { providers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleAddPolygonChain,
  signMessage,
  signArcanaMessage,
} from 'utils/ethereumFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import { getAccessToken, setAccessToken } from 'utils/authFn';
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
import { useNavigate } from 'react-router-dom';
import { getSessionStorageItem } from 'utils/sessionStorageFunc';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { handleError } from 'utils/handleUnAuthorization';

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
          `${config.ApiBaseUrl}/auth/generate-nonce/login`,
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
          if (!getSessionStorageItem('organisationName'))
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
      } else setError(e.message);
    }
  };

  return generateNonce;
};

interface IUserOnboardData {
  data: any;
}

const useUserOnboardData = () => {
  const accessToken = getAccessToken();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const onboardDataSave = useMutation(
    async (data: IUserOnboardData) => {
      console.log('data', data);
      const objectives = data.data[0].map(function (item: any) {
        return item.choice;
      });
      const response = await fetch(
        `${config.ApiBaseUrl}/user/signup-objective`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.userId,
            objectives,
          }),
        }
      );
      await handleApiErrors(response);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
      onSuccess: () => {
        navigate('/dashboard');
      },
    }
  );

  return onboardDataSave;
};

const useMetamaskSignup = (
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
          `${config.ApiBaseUrl}/auth/generate-nonce/sign-up`,
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
          if (!getSessionStorageItem('organisationName'))
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
      } else setError(e.message);
    }
  };

  return generateNonce;
};

const useWalletConnectSignup = (
  setNewUserId?: React.Dispatch<React.SetStateAction<number>>
) => {
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
      await walletConnectProvider.disconnect();

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
          if (setNewUserId) setNewUserId(json.user.userId);
          if (!getSessionStorageItem('organisationName'))
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

const useWalletConnectLogin = (
  setNewUserId?: React.Dispatch<React.SetStateAction<number>>
) => {
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
          if (setNewUserId) setNewUserId(json.user.userId);
          if (!getSessionStorageItem('organisationName'))
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

const useUnstoppableDomains = (
  setNewUserId?: React.Dispatch<React.SetStateAction<number>>
) => {
  const ac = new AbortController();
  const { signal } = ac;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uauth = new UAuth({
    clientID: import.meta.env.VITE_UD_CLIENT_KEY,
    redirectUri: config.AppDomain,
    scope: 'openid wallet profile:optional',
  });

  const signup = async (
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
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
        setError(response.statusText);
        const json: any = await handleApiErrors(response);
        dispatch(updateUser(json.user));
        setAccessToken(json.accessToken);
        dispatch(updateFirstTimeUser(json.isFirstTimeUser));
        dispatch(updateCurrentStep(2));
        if (setNewUserId) setNewUserId(json.user.userId);
        if (!getSessionStorageItem('organisationName')) navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
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
        setError(response.statusText);
        const json: any = await handleApiErrors(response);
        dispatch(updateUser(json.user));
        setAccessToken(json.accessToken);
        dispatch(updateFirstTimeUser(json.isFirstTimeUser));
        dispatch(updateCurrentStep(2));
        if (setNewUserId) setNewUserId(json.user.userId);
        if (!getSessionStorageItem('organisationName')) navigate('/dashboard');
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
  return { login, logout, signup };
};

const useArcanaWallet = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const ac = new AbortController();
  const { signal } = ac;
  const dispatch = useDispatch();

  const signup = async (
    walletId: string | undefined,
    provider: EthereumProvider
  ) => {
    try {
      if (walletId) {
        const payload = {
          walletId,
        };

        const response = await fetch(
          `${config.ApiBaseUrl}/auth/sign-up/generate-nonce/arcana`,
          {
            signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );

        if (response.status === 400) {
          toast.error('User already exists!', { id: 'error' });
          setTimeout(() => {
            navigate('/login');
            auth.logout();
          }, 3000);
        }
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
          if (!getSessionStorageItem('organisationName'))
            navigate('/dashboard');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loginSuccess = async (
    walletId: string | undefined,
    provider: EthereumProvider
  ) => {
    try {
      if (walletId) {
        const payload = {
          walletId,
        };

        const response = await fetch(
          `${config.ApiBaseUrl}/auth/login/generate-nonce/arcana`,
          {
            signal,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );
        if (response.status === 404) {
          toast.error("User doesn't exist!", { id: 'error' });
          setTimeout(() => {
            navigate('/sign_up');
            auth.logout();
          }, 3000);
        }
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
          navigate('/dashboard');
          setAccessToken(json2.accessToken);
          dispatch(updateFirstTimeUser(json.isFirstTimeUser));
        }
      }
    } catch (error: any) {
      // if (error?.message === 'Not Found') navigate('/sign-up');
    }
  };
  return { loginSuccess, signup };
};

export {
  useMetamaskLogin,
  useMetamaskSignup,
  useWalletConnectLogin,
  useUnstoppableDomains,
  useArcanaWallet,
  useWalletConnectSignup,
  useUserOnboardData,
};
