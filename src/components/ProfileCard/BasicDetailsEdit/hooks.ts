import { handleError } from 'utils/handleUnAuthorization';

import { useQuery } from '@tanstack/react-query';

interface IReturnType {
  data: any;
  isLoading: boolean;
  refetch: () => any;
}

const fetchNFTs = (walletId: any, agree: boolean): IReturnType => {
  const chain = 'polygon';
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isLoading, refetch } = useQuery(
    ['fetchNFTs'],
    async () => {
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2/${walletId}/nft?chain=${chain}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY || '',
          },
        }
      );
      const res = await response.json();
      return res;
    },
    {
      retry: 1,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({ error, explicitMessage: 'Unable to fetch nfts' });
      },
      enabled: false, // to run query on click
    }
  );
  return { data, isLoading, refetch };
};

export { fetchNFTs };
