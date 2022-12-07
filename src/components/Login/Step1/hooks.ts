import { updateCurrentStep, updateFirstTimeUser } from 'actions/auth';
import config from 'config';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { providers, ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import { handleAddPolygonChain, signMessage } from 'utils/ethereumFn';
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

interface IGenerateNonce {
  setError: Dispatch<SetStateAction<string>>;
}

const useMetamaskLogin = () => {
  const dispatch = useDispatch();

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

          console.log(payload2);

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
  const walletConnectProvider = useSelector(
    (state: RootState) => state.app.walletConnectProvider
  );

  const walletConnectGenerateNonce = async ({ setError }: IGenerateNonce) => {
    const ac = new AbortController();
    const { signal } = ac;

    try {
      await walletConnectProvider.enable();
      const web3Provider = new providers.Web3Provider(walletConnectProvider);
      console.log(web3Provider);

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

          console.log(payload2);

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
  const provider = detectMetamask();
  const ac = new AbortController();
  const { signal } = ac;
  const dispatch = useDispatch();
  // TODO: remove these hardcoded values
  const uauth = new UAuth({
    clientID: '9ef6576c-dc0a-43a8-83d0-e9d31512b00d',
    redirectUri: 'http://localhost:3000',
    scope: 'openid wallet profile',
  });
  const login = async () => {
    try {
      const authorization = await uauth.loginWithPopup();
      const walletAddress = authorization.idToken.wallet_address;

      if (
        authorization &&
        authorization.idToken &&
        authorization.idToken.wallet_address
      ) {
        const payload = {
          walletId: walletAddress,
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
            walletId: walletAddress,
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
        }
      }

      console.log('authorization', authorization);
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

export { useMetamaskLogin, useWalletConnectLogin, useUnstoppableDomains };
