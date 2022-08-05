/* eslint-disable camelcase */
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { AbiItem } from 'web3-utils';
import toast from 'react-hot-toast';
import { getWeb3Instance } from 'utils/web3EventFn';
import { RootState } from 'reducers';
import { projectManageContractAddress, USDCAddress } from 'contracts/contracts';
import { GET_WALLET_USDC_BALANCE } from 'actions/user/types';
import config from 'config';
import { IProfileSmartContractApiResponse } from 'interfaces/profile';
import USDCAbi from 'contracts/abi/USDC.sol/USDC.json';
import ProjectManageAbi from 'contracts/abi/ProjectManage.sol/ProjectManage.json';
import ProjectAbi from 'contracts/abi/Project.sol/Project.json';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';
import {
  GET_PROJECT_FOUNDER,
  GET_SELECTED_PROJECT_ADDRESS,
  IS_DEPOSITED,
} from 'actions/flProject/types';
import { useQuery } from '@tanstack/react-query';
import { handleError } from 'utils/handleUnAuthorization';

const useProject = () => {
  const [deploying, setDeploying] = useState('go_live');
  const [gasFee, setGasFee] = useState(0);

  const accessToken = getAccessToken();

  const dispatch = useDispatch();

  const walletId = useSelector((state: RootState) => state.user.user?.walletId);
  const { selectedProjectAddress } = useSelector(
    (state: RootState) => state.flProject
  );

  const getUSDCBalance = async () => {
    try {
      const web3 = getWeb3Instance();
      const USDCContract = new web3.eth.Contract(
        USDCAbi.abi as AbiItem[],
        USDCAddress
      );
      let balance = await USDCContract.methods.balanceOf(walletId).call();
      balance = Number(balance / Math.pow(10, 6)).toFixed(2);
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
      const web3 = getWeb3Instance();
      const ProjectManageContract = new web3.eth.Contract(
        ProjectManageAbi.abi as AbiItem[],
        projectManageContractAddress
      );
      const result = await ProjectManageContract.methods
        .getProjectContractAddresses(founder)
        .call();

      const address =
        result.filter(
          (project: any) => String(project.projectId) === String(id)
        ).length > 0
          ? result.filter(
              (project: any) => String(project.projectId) === String(id)
            )[0].contractAddress
          : '';

      if (address !== '') {
        const ProjectContract = new web3.eth.Contract(
          ProjectAbi.abi as AbiItem[],
          address
        );
        const isDeposited = await ProjectContract.methods.isDeposit().call();

        dispatch({
          type: IS_DEPOSITED,
          payload: isDeposited,
        });
        dispatch({
          type: GET_SELECTED_PROJECT_ADDRESS,
          payload: address,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getGasFeeToPublish = async () => {
    try {
      const web3 = getWeb3Instance();
      // const ProjectContract = new web3.eth.Contract(ProjectAbi.abi as AbiItem[], projectManageContractAddress);
      // ProjectContract.deploy({
      //     data: ProjectAbi.bytecode,
      //     arguments: [1, USDCAddress, 'test', 'testtest', 1000]
      // })
      //     .estimateGas(function (err, gas) {
      //         console.log(gas);
      //     });
      // var gasEstimate = await web3.eth.estimateGas({ data: ProjectAbi.bytecode });
      // console.log(">>>>>>>>>", gasEstimate);

      const projectManageContract = new web3.eth.Contract(
        ProjectManageAbi.abi as AbiItem[],
        projectManageContractAddress
      );
      let result = await projectManageContract.methods
        .createProject(1, USDCAddress, 'test', 'testtest', 1000)
        .estimateGas({ from: walletId });
      result = Number(Number(result / Math.pow(10, 6)).toFixed(4));
      setGasFee(result);
    } catch (err) {
      console.log(err);
    }
  };

  const publishProject = async (
    projectId: string,
    budget: number,
    name: string,
    description: string
  ) => {
    const web3 = getWeb3Instance();
    const projectManageContract = new web3.eth.Contract(
      ProjectManageAbi.abi as AbiItem[],
      projectManageContractAddress
    );
    const result = await projectManageContract.methods
      .checkProjectExist(walletId, projectId)
      .call();
    if (result) {
      toast.error('Project already exist');
      return;
    }
    projectManageContract.methods
      .createProject(
        projectId,
        USDCAddress,
        name,
        description,
        Number(budget * Math.pow(10, 6)).toFixed(0)
      )
      .send({ from: walletId })
      .on('transactionHash', (hash: any) => {
        setDeploying('deploying');
      })
      .on('receipt', (receipt: any) => {
        console.log(
          'Deployed project contract address: ',
          receipt.events.DeployedNewProject.returnValues[1]
        );
        setDeploying('deploy_success');
        dispatch({
          type: GET_SELECTED_PROJECT_ADDRESS,
          payload: receipt.events.DeployedNewProject.returnValues[1],
        });
        saveProjectContractAddress(
          receipt.events.DeployedNewProject.returnValues[1],
          projectId
        );
        setTimeout(() => {
          setDeploying('deposit');
        }, 2000);
      })
      .on('error', (err: any) => {
        toast.error('Error happens while deploying contract');
        setDeploying('go_live');
      });
  };

  const depositFunds = async (budget: number) => {
    try {
      const web3 = getWeb3Instance();
      const USDCContract = new web3.eth.Contract(
        USDCAbi.abi as AbiItem[],
        USDCAddress
      );
      USDCContract.methods
        .approve(
          selectedProjectAddress,
          Number(budget * 1.1 * Math.pow(10, 6)).toFixed(0)
        )
        .send({ from: walletId })
        .on('transactionHash', (hash: any) => {
          setDeploying('approving')
        })
        .on('receipt', (receipt: any) => {
          const projectContract = new web3.eth.Contract(
            ProjectAbi.abi as AbiItem[],
            selectedProjectAddress
          );
          projectContract.methods
            .depositFunds(
              Number(budget * 1.1 * Math.pow(10, 6)).toFixed(0)
            )
            .send({ from: walletId })
            .on('transactionHash', (hash: any) => {
              setDeploying('depositing');
            })
            .on('receipt', (receipt: any) => {
              setDeploying('deposit_success');
              dispatch({
                type: IS_DEPOSITED,
                payload: true,
              });
            })
            .on('error', (err: any) => {
              setDeploying('deposit');
            });
        })
        .on('error', (error: any) => {
          setDeploying('failed');
        })
    } catch (err) {
      console.log(err);
    }
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
      const json: IProfileSmartContractApiResponse = await handleApiErrors(
        response
      );
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFounder = async (project_address: string) => {
    try {
      const web3 = getWeb3Instance();
      const projectManageContract = new web3.eth.Contract(
        ProjectManageAbi.abi as AbiItem[],
        projectManageContractAddress
      );
      const result = await projectManageContract.methods
        .getFounderFromProjectAddress(project_address)
        .call();
      dispatch({
        type: GET_PROJECT_FOUNDER,
        payload: result,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return {
    getGasFeeToPublish,
    getUSDCBalance,
    publishProject,
    getOnChainProject,
    depositFunds,
    setDeploying,
    fetchFounder,
    deploying,
    gasFee,
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
