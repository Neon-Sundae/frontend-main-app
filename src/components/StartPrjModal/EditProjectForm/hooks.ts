import config from 'config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccessToken } from 'utils/authFn';
import { handleError } from 'utils/handleUnAuthorization';
import { useParams } from 'react-router-dom';
import { handleApiErrors } from 'utils/handleApiErrors';

const useProjectData = () => {
  const { create: projectId } = useParams();

  const accessToken = getAccessToken();
  const { data } = useQuery(
    ['projectData'],
    async ({ signal }) => {
      const res = await fetch(`${config.ApiBaseUrl}/fl-project/${projectId}`, {
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const json = await res.json();
      return json;
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        handleError({ error, explicitMessage: 'Unable to fetch project data' });
      },
    }
  );
  return { projectData: data };
};

interface IUpdateProjectResource {
  flResourceId: number;
  title: string;
}

const useUpdateProjectResources = () => {
  const { create: projectId } = useParams();
  const accessToken = getAccessToken();

  const updateTaskChecklist = useMutation(
    async (payload: IUpdateProjectResource) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/${projectId}/resource/${payload.flResourceId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      await handleApiErrors(response);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return updateTaskChecklist;
};

interface IUpdateProjectData {
  name: string;
  description: string;
  timeOfCompletion: string;
  preferredTimeZones: string;
  budget: number;
}

const useUpdateProjectData = () => {
  const queryClient = useQueryClient();
  const { create: projectId } = useParams();
  const accessToken = getAccessToken();

  const updateProjectData = useMutation(
    async (payload: IUpdateProjectData) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/${projectId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      await handleApiErrors(response);
      queryClient.invalidateQueries(['projectData']);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return updateProjectData;
};

interface ICreateProjectResource {
  title: string;
}

const useCreateProjectResource = () => {
  const queryClient = useQueryClient();
  const { create: projectId } = useParams();
  const accessToken = getAccessToken();
  const updateProjectResource = useMutation(
    async (payload: ICreateProjectResource) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/${projectId}/resource`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      await handleApiErrors(response);
      queryClient.invalidateQueries(['projectData']);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );
  return updateProjectResource;
};

interface IDeleteProjectResource {
  flResourceId: number;
}

const useDeleteProjectResource = () => {
  const queryClient = useQueryClient();
  const { create: projectId } = useParams();
  const accessToken = getAccessToken();
  const deleteProjectResource = useMutation(
    async (payload: IDeleteProjectResource) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/${projectId}/resource/${payload.flResourceId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      await handleApiErrors(response);
      queryClient.invalidateQueries(['projectData']);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );
  return deleteProjectResource;
};

interface ICreateNewCategory {
  categoryName: string;
  percentageAllocation: number;
}

const useCreateNewCategory = () => {
  const queryClient = useQueryClient();
  const { create: projectId } = useParams();
  const accessToken = getAccessToken();

  const createNewCategory = useMutation(
    async (payload: ICreateNewCategory) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/${projectId}/category`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      await handleApiErrors(response);
      queryClient.invalidateQueries(['projectData']);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return createNewCategory;
};

interface IDeleteCategory {
  categoryId: number;
}

const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { create: projectId } = useParams();
  const accessToken = getAccessToken();

  const deleteCategory = useMutation(
    async (payload: IDeleteCategory) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/${projectId}/category/${payload.categoryId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      await handleApiErrors(response);
      queryClient.invalidateQueries(['projectData']);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return deleteCategory;
};

interface IUpdateCategory {
  categoryId: number;
  categoryName: string;
  percentageAllocation: number;
}

const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { create: projectId } = useParams();
  const accessToken = getAccessToken();

  const updateCategory = useMutation(
    async (payload: IUpdateCategory) => {
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/${projectId}/category/${payload.categoryId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categoryName: payload.categoryName,
            percentageAllocation: payload.percentageAllocation,
          }),
        }
      );
      await response.json();
      queryClient.invalidateQueries(['projectData']);
    },
    {
      retry: 1,
      onError: (error: any) => {
        handleError({ error });
      },
    }
  );

  return updateCategory;
};

export {
  useProjectData,
  useUpdateProjectResources,
  useUpdateProjectData,
  useCreateProjectResource,
  useDeleteProjectResource,
  useCreateNewCategory,
  useDeleteCategory,
  useUpdateCategory,
};
