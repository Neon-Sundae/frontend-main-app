import { useMutation, useQuery } from '@tanstack/react-query';
import { handleError } from 'utils/handleUnAuthorization';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { Dispatch, SetStateAction } from 'react';
import { handleApiErrors } from 'utils/handleApiErrors';

interface IReturnType {
  data: any;
  isLoading: boolean;
  refetch: () => any;
}

const fetchAllProjectTemplates = (
  setCurrentTemplate: Dispatch<SetStateAction<null>>
): IReturnType => {
  const accessToken = getAccessToken();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data, isLoading, refetch } = useQuery(
    ['fetchAllProjectTemplates'],
    async () => {
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/templates/all`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const res = await response.json();
      return res;
    },
    {
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      onSuccess: (res: any) => {
        setCurrentTemplate(res[0]);
      },
      onError: (error: any) => {
        handleError({
          error,
          explicitMessage: 'Unable to fetch project templates',
        });
      },
    }
  );
  return { data, isLoading, refetch };
};

interface ICreateProjectFromTemplate {
  name: string;
  description: string;
  timeOfCompletion: string;
  budget: number;
  preferredTimeZones: string;
  organisationId: number;
  flResources: object[];
  flProjectCategory: object[];
}

const useCreateProjectFromTemplate = () => {
  const accessToken = getAccessToken();
  const createProjectFromTemplate = useMutation(
    async (payload: ICreateProjectFromTemplate) => {
      return fetch(`${config.ApiBaseUrl}/fl-project`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          console.log(data);
        });
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return createProjectFromTemplate;
};

// TODO: create required categories
// TODO: create required resources

// eslint-disable-next-line import/prefer-default-export
export { fetchAllProjectTemplates, useCreateProjectFromTemplate };
