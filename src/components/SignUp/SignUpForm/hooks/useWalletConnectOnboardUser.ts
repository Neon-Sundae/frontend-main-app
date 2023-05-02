import { updateFirstTimeUser } from 'actions/auth';
import { updateUser } from 'actions/user';
import config from 'config';
import { providers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'reducers';
import { setAccessToken } from 'utils/authFn';
import { signMessage } from 'utils/ethereumFn';
import { handleApiErrors } from 'utils/handleApiErrors';

const useWalletConnectOnboardUser = () => {
  const dispatch = useDispatch();

  const walletConnectProvider = useSelector(
    (state: RootState) => state.app.walletConnectProvider
  );

  const walletConnectGenerateNonce = async (
    setApiStep: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const ac = new AbortController();
    const { signal } = ac;

    try {
      await walletConnectProvider.enable();
      const web3Provider = new providers.Web3Provider(walletConnectProvider);

      const accounts = await web3Provider.listAccounts();

      const { chainId } = await web3Provider.getNetwork();

      await walletConnectProvider.disconnect();

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
        setApiStep(2);

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
          setApiStep(3);
        }
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return walletConnectGenerateNonce;
};
export default useWalletConnectOnboardUser;
