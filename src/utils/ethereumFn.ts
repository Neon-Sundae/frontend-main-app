import { ethers } from 'ethers';

export const handleAddPolygonChain = async (provider: any) => {
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: `0x${Number(137).toString(16)}`,
          chainName: 'Polygon',
          nativeCurrency: {
            name: 'Polygon Mainnet',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://polygon-rpc.com/'],
          blockExplorerUrls: ['https://polygonscan.com/'],
        },
      ],
    });
  } catch (err: any) {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log('Please connect to MetaMask.');
    } else {
      console.error(err);
    }
  }
};

export const signMessage = async (provider: any, message: string) => {
  try {
    const etherProvider = new ethers.providers.Web3Provider(provider);
    const signer = etherProvider.getSigner();
    const signature = await signer.signMessage(message);

    return signature;
  } catch (err) {
    console.log(err);
  }

  return null;
};
