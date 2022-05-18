// @ts-ignore
import Web3 from "web3/dist/web3.min.js";
import axios from "axios";

const web3 = new Web3(
  Web3.givenProvider || "ws://some.local-or-remote.node:8546"
);

const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;

export const connectToMetaMaskWallet = async (): Promise<any> => {
  try {
    const walletId = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result: any) => {
        return result[0];
      })
      .catch((err: any) => {
        return err;
      });
    return walletId;
  } catch {
    throw "error";
  }
};

export const fetchUserFromWalletId = async (walletId: any) => {
  const options = {
    method: "GET",
    url: `${backendDomain}/auth/login`,
    headers: { walletid: walletId },
  };
  try {
    const userData = await axios
      .request(options)
      .then((response: any) => {
        return response;
      })
      .catch(function (error) {
        console.error(error);
      });
    return userData;
  } catch {
    throw new Error("You need to sign the message to be able to log in.");
  }
};

export const generateAToken = async (userData: any) => {
  const {
    data: { nonce, walletId, id },
  } = userData;
  try {
    const sig = await web3!.eth.personal.sign(
      `I am signing my one-time nonce: ${nonce}`,
      walletId,
      "" // MetaMask will ignore the password argument here
    );
    const options = {
      method: "GET",
      url: `${backendDomain}/auth/verify`,
      headers: {
        id: id,
        sig: sig,
        nonce: nonce,
        walletid: walletId,
      },
    };
    const tokens = axios
      .request(options)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.error(error);
      });
    return tokens;
  } catch (err) {
    throw new Error("You need to sign the message to be able to log in.");
  }
};
