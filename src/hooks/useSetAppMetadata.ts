// @ts-ignore
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js';
import { useAuth, useProvider } from '@arcana/auth-react';
import { setWalletConnectProvider } from 'actions/app';
import config from 'config';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  handleAccountsChanged,
  handleArcanaDisconnectedEvent,
  handleArcanaLogout,
  handleChainChanged,
  handleSwitchChange,
} from 'utils/web3EventFn';

const useSetAppMetadata = () => {
  const auth: any = useAuth();
  const { provider: arcanaProvider } = useProvider();
  const dispatch = useDispatch();

  const provider = new WalletConnectProvider({
    rpc: {
      137: 'https://polygon-rpc.com',
    },
    bridge: 'https://bridge.walletconnect.org',
  });

  useEffect(() => {
    dispatch(setWalletConnectProvider(provider));
    if (!auth.provider.connected) handleArcanaDisconnectedEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      (async () => {
        const chainId = await window.ethereum.request({
          method: 'eth_chainId',
        });
        console.log(chainId);

        if (chainId !== config.chainId) {
          handleSwitchChange(window.ethereum, config.chainId);
        }
      })();
    }
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
