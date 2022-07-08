import { useDispatch, useSelector } from 'react-redux';
import { AbiItem } from 'web3-utils';
import { getWeb3Instance } from 'utils/web3EventFn';
import { RootState } from 'reducers';
import { projectManageContractAddress, USDCAddress } from 'contracts/contracts';
import { GET_WALLET_USDC_BALANCE } from 'actions/user/types';
import USDCAbi from 'contracts/abi/USDCToken.sol/USDCToken.json';
import ProjectManageAbi from 'contracts/abi/ProjectManage.sol/ProfileManage.json';
import toast from 'react-hot-toast';

const useProject = () => {

    const dispatch = useDispatch();

    const walletId = useSelector((state: RootState) => state.user.user?.walletId);

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

    const getOnChainProject = async () => {
        try {
            const web3 = getWeb3Instance();
            const ProjectManageContract = new web3.eth.Contract(ProjectManageAbi.abi as AbiItem[], projectManageContractAddress);
            const result = await ProjectManageContract.methods.getProjectContractAddresses(walletId).call();
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }

    const getGasFeeToPublish = async () => {
        try {
            const web3 = getWeb3Instance();
            const projectManageContract = new web3.eth.Contract(ProjectManageAbi.abi as AbiItem[], projectManageContractAddress);
            const result = await projectManageContract.methods.createProject(USDCAddress, 'test', 'testtest', 1000).estimateGas({ from: walletId });
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }

    const publishProject = async () => {
        try {
            const web3 = getWeb3Instance();
            const projectManageContract = new web3.eth.Contract(ProjectManageAbi.abi as AbiItem[], projectManageContractAddress);
            const result = await projectManageContract.methods.createProject(USDCAddress, 'test', 'testtest', 1000).send({ from: walletId });
            toast.success("Project published successfully");
        } catch (err) {
            console.log(err);
        }
    }

    return { getGasFeeToPublish, getUSDCBalance, publishProject, getOnChainProject }
}

export default useProject;