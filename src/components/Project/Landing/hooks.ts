import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { RootState } from 'reducers';
import { GET_WALLET_USDC_BALANCE } from 'actions/user/types';
import config from 'config';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import {
  GET_PROJECT_FOUNDER,
  GET_SELECTED_PROJECT_ADDRESS,
  SET_PROJECT_TASK_ADDRESS,
} from 'actions/flProject/types';
import { useQuery } from '@tanstack/react-query';
import { handleError } from 'utils/handleUnAuthorization';
import getUsdcBalance from 'utils/contractFns/getUsdcBalance';
import checkProjectExist from 'utils/contractFns/checkProjectExist';
import getFounderFromProject from 'utils/contractFns/getFounderFromProject';
import createProjectContract from 'utils/contractFns/createProjectContract';
import createProjectTaskContract from 'utils/contractFns/createProjectTaskContract';
import saveProjectContractAddress from 'hooks/saveProjectContractAddress';
import { useAuth } from '@arcana/auth-react';

const useProject = () => {
  const auth = useAuth();
  const dispatch = useDispatch();

  const [deploying, setDeploying] = useState('go_live');

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);

  const getUSDCBalance = async () => {
    try {
      const balance = await getUsdcBalance(walletId, auth);
      dispatch({
        type: GET_WALLET_USDC_BALANCE,
        payload: balance,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const publishProject = async (projectId: string) => {
    // * Discuss
    // * This check is done on smart contract also
    // * Discuss whether this check is again needed or not here

    const result = await checkProjectExist(walletId, projectId, auth);

    if (result) {
      toast.error('Project already exist');
      return;
    }

    const projectAddress = await createProjectContract({
      projectId,
      walletId,
      dispatch,
      setDeploying,
      auth,
    });

    const projectTaskAddress = await createProjectTaskContract({
      walletId,
      projectAddress,
      dispatch,
      auth,
    });

    await saveProjectContractAddress(
      { projectTaskContract: projectTaskAddress },
      projectId
    );
  };

  const fetchFounder = async (project_address: string) => {
    try {
      const result = await getFounderFromProject(project_address, auth);
      dispatch({
        type: GET_PROJECT_FOUNDER,
        payload: result,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    getUSDCBalance,
    publishProject,
    // getOnChainProject,
    setDeploying,
    fetchFounder,
    deploying,
  };
};

const useFetchProjects = (create: any) => {
  const dispatch = useDispatch();
  const { data } = useQuery(
    ['projectData'],
    async ({ signal }) => {
      const res = await fetch(`${config.ApiBaseUrl}/fl-project/${create}`, {
        signal,
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });
      const json = await handleApiErrors(res);

      if (json.smartContractId) {
        dispatch({
          type: GET_SELECTED_PROJECT_ADDRESS,
          payload: json.smartContractId,
        });
      }

      if (json.projectTaskContract) {
        dispatch({
          type: SET_PROJECT_TASK_ADDRESS,
          address: json.projectTaskContract,
        });
      }

      return json;
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      enabled: create !== undefined || create !== null,
      onError: (error: any) => {
        handleError({ error, explicitMessage: 'Unable to fetch project data' });
      },
    }
  );
  return { projectData: data };
};

export { useProject, useFetchProjects };
