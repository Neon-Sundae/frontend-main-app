import { useQuery } from '@tanstack/react-query';
import config from 'config';
import { handleApiErrors } from 'utils/handleApiErrors';
import { handleError } from 'utils/handleUnAuthorization';

const useFetchUsersViaEmail = (
  email: string | null,
  setIsUser: React.Dispatch<React.SetStateAction<boolean | null>>
) => {
  const { data } = useQuery(
    ['user_from_email'],
    async () => {
      const response = await fetch(`${config.ApiBaseUrl}/user/email`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      const json = await handleApiErrors(response);
      console.log(json);
      return json;
    },
    {
      retry: 0,
      enabled: !!email,
      refetchOnWindowFocus: false,
      onSuccess: (res: any) => {
        setIsUser(!!res.userExists);
      },
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to find any user',
        });
      },
    }
  );
  return { checkExistingUser: data };
};

export default useFetchUsersViaEmail;
