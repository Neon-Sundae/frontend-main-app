import Web3 from 'web3';

const MINIMUM_GAS_PRICE = 40;

const estimateGasPrice = async (web3: Web3) => {
  const minimum = MINIMUM_GAS_PRICE * 1000000000;

  try {
    const e = await web3.eth.getGasPrice();
    let gasPrice = e ? Number(e) : undefined;
    if (!gasPrice || gasPrice < minimum) {
      gasPrice = minimum;
    }
    console.log({ gasPrice });
    return gasPrice.toString();
  } catch {
    return minimum.toString();
  }
};

export default estimateGasPrice;
