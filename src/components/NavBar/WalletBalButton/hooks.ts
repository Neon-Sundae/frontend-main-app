import { useCallback } from "react"
import { AbiItem } from 'web3-utils'
import { getWeb3Instance } from "utils/web3EventFn"
import profileAbi from 'contracts/abi/Profile.sol/Profile.json';

const useWithdrawFund = () => {

    const withdrawFund = useCallback(async (address: string) => {
        try {
            const web3 = getWeb3Instance();
            const accounts = await web3.eth.getAccounts();
            const profileContract = new web3.eth.Contract(profileAbi.abi as AbiItem[], address);
            await profileContract.methods.withdraw().send({ from: accounts[0] });
            alert('Withdraw success!');
        } catch (err) {
            console.log(err);
        }
    }, [])

    return { withdrawFund }
}

export default useWithdrawFund;