import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useArcanaLogin = (
  walletId: string | null,
  setError: React.Dispatch<React.SetStateAction<string>>
) => {
  const { data } = useQuery(
    ['arcana_login'],
    async () => {
      const response = await fetch(
        `${config.ApiBaseUrl}/auth/login/generate-nonce/arcana`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ walletId }),
        }
      );
      const json = await handleApiErrors(response);
      return json;
    },
    {
      retry: 0,
      enabled: !!walletId,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        setError(error);
        handleError({
          error,
          explicitMessage: 'Unable to find any user',
        });
      },
    }
  );
  return { data };
};

export default useArcanaLogin;
