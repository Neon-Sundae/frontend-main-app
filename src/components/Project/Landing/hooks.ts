/* eslint-disable camelcase */
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { AbiItem } from 'web3-utils';
import toast from 'react-hot-toast';
import { getWeb3Instance } from 'utils/web3EventFn';
import { RootState } from 'reducers';
import { USDCAddress } from 'contracts/contracts';
import { GET_WALLET_USDC_BALANCE } from 'actions/user/types';
import config from 'config';
import ProjectManageAbi from 'contracts/abi/ProjectManage.sol/ProjectManage.json';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import {
  GET_PROJECT_FOUNDER,
  GET_SELECTED_PROJECT_ADDRESS,
} from 'actions/flProject/types';
import { useQuery } from '@tanstack/react-query';
import { handleError } from 'utils/handleUnAuthorization';
import getUsdcBalance from 'utils/contractFns/getUsdcBalance';
import getAllProjects from 'utils/contractFns/getAllProjects';
import checkProjectExist from 'utils/contractFns/checkProjectExist';
import getFounderFromProject from 'utils/contractFns/getFounderFromProject';

const useProject = () => {
  const web3 = getWeb3Instance();
  const dispatch = useDispatch();
  const accessToken = getAccessToken();

  const [deploying, setDeploying] = useState('go_live');

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedProjectAddress } = useSelector(
    (state: RootState) => state.flProject
  );

  const getUSDCBalance = async () => {
    try {
      const balance = await getUsdcBalance(walletId);
      dispatch({
        type: GET_WALLET_USDC_BALANCE,
        payload: balance,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getOnChainProject = async (id: string | undefined, founder: string) => {
    try {
      const result = await getAllProjects(founder);

      const address =
        result.filter(
          (project: any) => String(project.projectId) === String(id)
        ).length > 0
          ? result.filter(
              (project: any) => String(project.projectId) === String(id)
            )[0].contractAddress
          : '';

      if (address !== '') {
        dispatch({
          type: GET_SELECTED_PROJECT_ADDRESS,
          payload: address,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * TODO Proxy
   * replace project manage with project factory
   */
  const publishProject = async (projectId: string) => {
    const projectManageContract = new web3.eth.Contract(
      ProjectManageAbi.abi as AbiItem[],
      projectManageContractAddress
    );

    const result = await checkProjectExist(walletId, projectId);

    if (result) {
      toast.error('Project already exist');
      return;
    }

    projectManageContract.methods
      .createProject(projectId, USDCAddress)
      .send({ from: walletId })
      .on('transactionHash', (hash: any) => {
        setDeploying('deploying');
      })
      .on('receipt', (receipt: any) => {
        setDeploying('deploy_success');
        dispatch({
          type: GET_SELECTED_PROJECT_ADDRESS,
          payload: receipt.events.DeployedNewProject.returnValues[1],
        });
        saveProjectContractAddress(
          receipt.events.DeployedNewProject.returnValues[1],
          projectId
        );
      })
      .on('error', (err: any) => {
        toast.error('Error happens while deploying contract');
        setDeploying('go_live');
      });
  };

  const saveProjectContractAddress = async (
    address: string,
    projectId: string
  ) => {
    try {
      const ac = new AbortController();
      const { signal } = ac;

      const payload = {
        smartContractId: address,
      };
      const response = await fetch(
        `${config.ApiBaseUrl}/fl-project/${projectId}`, // TODO - Need to update projectId here
        {
          signal,
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      await handleApiErrors(response);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFounder = async (project_address: string) => {
    try {
      const result = await getFounderFromProject(project_address);
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
    getOnChainProject,
    setDeploying,
    fetchFounder,
    deploying,
  };
};

const useFetchProjects = (create: any) => {
  const { data } = useQuery(
    ['projectData'],
    async ({ signal }) => {
      if (create) {
        const res = await fetch(`${config.ApiBaseUrl}/fl-project/${create}`, {
          signal,
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        });
        const json = await handleApiErrors(res);
        return json;
      }

      // create is falsy so throw error
      throw new Error('Error');
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

export { useProject, useFetchProjects };
