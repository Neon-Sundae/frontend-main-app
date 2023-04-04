// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js';
import { useProvider } from '@arcana/auth-react';
import { setWalletConnectProvider } from 'actions/app';
import config from 'config';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  handleAccountsChanged,
  handleArcanaDisconnectedEvent,
  handleArcanaLogout,
  handleChainChanged,
  handleSwitchChange,
} from 'utils/web3EventFn';
import { RootState } from 'reducers';

const useSetAppMetadata = () => {
  const user = useSelector((state: RootState) => state.user.user);

  const { provider: arcanaProvider } = useProvider();

  if (user?.authentication_method === 'arcana_network') {
    if (!(arcanaProvider as any).connected) handleArcanaDisconnectedEvent();
  }

  const dispatch = useDispatch();

  const provider = new WalletConnectProvider({
    rpc: {
      137: 'https://polygon-rpc.com',
    },
    bridge: 'https://bridge.walletconnect.org',
  });

  useEffect(() => {
    dispatch(setWalletConnectProvider(provider));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      (async () => {
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
        console.log('chainId', chainId);
        if (chainId !== config.chainId) {
          handleSwitchChange(window.ethereum, config.chainId);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      arcanaProvider.on('disconnect', handleArcanaLogout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useSetAppMetadata;
