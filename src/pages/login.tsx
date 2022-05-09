// @ts-ignore
import Web3 from "web3/dist/web3.min.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const web3 = new Web3(
  Web3.givenProvider || "ws://some.local-or-remote.node:8546"
);

const Login = () => {
  const navigate = useNavigate();
  const connectToMetaMask = async () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result: any) => {
        fetchUsersFromWalletId(result[0]);
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  };
  const fetchUsersFromWalletId = async (walletId: any) => {
    const options = {
      method: "GET",
      url: "http://localhost:3001/auth/verify-walletid",
      headers: {
        "Content-Type": "application/json",
        walletId: walletId.toLowerCase(),
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        if (!response.data.length) {
          navigate("../get-started", { replace: true });
        } else {
          const nonce = response.data[0].nonce;
          generateAToken(nonce, walletId);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const generateAToken = async (nonce: number, walletId: string) => {
    try {
      const signature = await web3!.eth.personal.sign(
        `I am signing my one-time nonce: ${nonce}`,
        walletId,
        "" // MetaMask will ignore the password argument here
      );
      const options = {
        method: "GET",
        url: "http://localhost:3001/auth/verify-signature",
        headers: {
          signature: signature,
          nonce: nonce,
          walletId: walletId,
        },
      };
      axios
        .request(options)
        .then(function (response) {
          // fixme: remove this later
          console.log("response.data", response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
      return { signature, nonce };
    } catch (err) {
      throw new Error("You need to sign the message to be able to log in.");
    }
  };

  return (
    <>
      <button onClick={connectToMetaMask}>Use Metamask</button>
    </>
  );
};

export default Login;
