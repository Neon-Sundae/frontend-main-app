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
import USDCAbi from 'contracts/abi/USDCToken.sol/USDCToken.json';
import ProjectManageAbi from 'contracts/abi/ProjectManage.sol/ProjectManage.json';
import ProjectAbi from 'contracts/abi/Project.sol/Project.json';
import { getAccessToken } from 'utils/authFn';
import { handleApiErrors } from 'utils/handleApiErrors';

const useProject = () => {

    const [deploying, setDeploying] = useState('go_live');
    const [deployedAddress, setDeployedAddress] = useState('');
    const [gasFee, setGasFee] = useState(0);
    const [budget, setBudget] = useState(0);

    const accessToken = getAccessToken();

    const dispatch = useDispatch();

    const walletId = useSelector((state: RootState) => state.user.user?.walletId);
    const userId = useSelector((state: RootState) => state.user.user?.userId);

    const getUSDCBalance = async () => {
        try {
            const web3 = getWeb3Instance();
            const USDCContract = new web3.eth.Contract(USDCAbi.abi as AbiItem[], USDCAddress);
            let balance = await USDCContract.methods.balanceOf(walletId).call();
            balance = Number(web3.utils.fromWei(balance, 'ether')).toFixed(2);
            dispatch({
                type: GET_WALLET_USDC_BALANCE,
                payload: balance
            })
        } catch (err) {
            console.log(err);
        }
    }

    const getOnChainProject = async (id: number) => {
        try {
            const web3 = getWeb3Instance();
            const ProjectManageContract = new web3.eth.Contract(ProjectManageAbi.abi as AbiItem[], projectManageContractAddress);
            let result = await ProjectManageContract.methods.getProjectContractAddresses(walletId).call();

            const address = result.filter((project: any) => String(project.projectId) === String(id)).length > 0 ?
                result.filter((project: any) => String(project.projectId) === String(id))[0].contractAddress : ''
            setDeployedAddress(address);
            if (address !== '') {
                const projectContract = new web3.eth.Contract(ProjectAbi.abi as AbiItem[], address);
                result = await projectContract.methods.budget().call();
                setBudget(result)
            }
        } catch (err) {
            console.log(err);
        }
    }

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

            const projectManageContract = new web3.eth.Contract(ProjectManageAbi.abi as AbiItem[], projectManageContractAddress);
            let result = await projectManageContract.methods.createProject(1, USDCAddress, 'test', 'testtest', 1000).estimateGas({ from: walletId });
            result = Number(web3.utils.fromWei(Number(result).toString(), 'ether'))
            setGasFee(result);
        } catch (err) {
            console.log(err);
        }
    }

    const publishProject = async () => {
        const web3 = getWeb3Instance();
        const projectManageContract = new web3.eth.Contract(ProjectManageAbi.abi as AbiItem[], projectManageContractAddress);
        const result = await projectManageContract.methods.checkProjectExist(walletId, 1).call()
        if (result) {
            toast.error("Project already exist");
            return;
        }
        projectManageContract.methods.createProject(1, USDCAddress, 'test', 'testtest', 1000)
            .send({ from: walletId })
            .on('transactionHash', (hash: any) => {
                setDeploying('deploying');
            })
            .on('receipt', (receipt: any) => {
                toast.success("Project published successfully");
                setDeploying('deploy_success');
                setDeployedAddress(receipt.events.DeployedNewProject.returnValues[1]);
                setBudget(1000);
                saveProjectContractAddress(receipt.events.DeployedNewProject.returnValues[1], 1);
                setTimeout(() => {
                    setDeploying('deposit');
                }, 2000);
            })
            .on('error', (err: any) => {
                toast.error('Error happens while deploying contract');
                setDeploying('deploy_failed');
            })
    }

    const depositFunds = async () => {
        try {
            const web3 = getWeb3Instance();

            const USDCContract = new web3.eth.Contract(USDCAbi.abi as AbiItem[], USDCAddress);
            await USDCContract.methods.approve(deployedAddress, web3.utils.toWei(String(1100))).send({ from: walletId })

            const projectContract = new web3.eth.Contract(ProjectAbi.abi as AbiItem[], deployedAddress);
            projectContract.methods.depositFunds(1100)
                .send({ from: walletId })
                .on('transactionHash', (hash: any) => {
                    setDeploying('depositing');
                })
                .on('receipt', (receipt: any) => {
                    setDeploying('deposit_success');
                })
                .on('error', (err: any) => {
                    setDeploying('deposit_failed');
                });
            // TODO: change project id
            getOnChainProject(1);
        } catch (err) {
            console.log(err);
        }
    }

    const saveProjectContractAddress = async (address: string, projectId: number) => {
        try {
            const ac = new AbortController();
            const { signal } = ac;

            const payload = {
                smartContractId: address
            }
            const response = await fetch(
                `${config.ApiBaseUrl}/fl-project/${projectId}`,
                {
                    signal,
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload)
                }
            );
            const json: IProfileSmartContractApiResponse = await handleApiErrors(response);
        } catch (err) {
            console.log(err);
        }
    }

    return {
        getGasFeeToPublish,
        getUSDCBalance,
        publishProject,
        getOnChainProject,
        depositFunds,
        deploying,
        deployedAddress,
        gasFee,
        budget
    }
}

export default useProject;