import { AbiItem } from "web3-utils";
import { getWeb3Instance } from "utils/web3EventFn";
import profileManageAbi from 'contracts/abi/ProfileManage.sol/ProfileManage.json';
import { profileManageContractAddress, USDCAddress } from "contracts/contracts";
import { useDispatch } from "react-redux";
import { GET_PROFILE_CONTRACT_ADDRESS } from "actions/profile/types";

const useProfileManage = () => {

    const dispatch = useDispatch();

    const createProfile = async (name: string | null | undefined, title: string | null | undefined, address: string | undefined) => {
        try {
            const web3 = getWeb3Instance();
            const profileManageContract = new web3.eth.Contract(profileManageAbi.abi as AbiItem[], profileManageContractAddress);
            await profileManageContract.methods.createProfile(USDCAddress, name, title)
                .send({ from: address });

            const contractAddress = await profileManageContract.methods.getProfileContractAddress(address).call();
            dispatch({
                type: GET_PROFILE_CONTRACT_ADDRESS,
                payload: contractAddress
            })
        } catch (err) {
            console.log(err);
        }
    }

    return { createProfile }
}

export default useProfileManage;