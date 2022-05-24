import jwt_decode from "jwt-decode";
import { ethers } from "ethers";

const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;
const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

export const connectToMetaMaskWallet = async (): Promise<any> => {
  try {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const walletId = await signer.getAddress();
    localStorage.setItem("walletId", walletId);
    return walletId;
  } catch {
    throw "error";
  }
};

export const loginOrRegister = async (walletId: any) => {
  try {
    const userData = await fetch(`${backendDomain}/auth/login`, {
      method: "GET",
      headers: {
        walletid: walletId,
      },
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
    return userData;
  } catch {
    throw new Error("You need to sign the message to be able to log in.");
  }
};

export const generateAToken = async (userData: any) => {
  const { nonce, id, walletId } = userData;
  try {
    const from = walletId;
    const message: any = `I am signing my one-time nonce: ${nonce}`;
    const sig = await provider.provider.request?.({
      method: "personal_sign",
      params: [message, from, ""],
    });
    const tokens = await fetch(`${backendDomain}/auth/verify`, {
      method: "POST",
      headers: {
        id: id,
        sig: sig,
        nonce: nonce,
        walletid: walletId,
      },
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
    return tokens;
  } catch (err) {
    throw new Error("You need to sign the message to be able to log in.");
  }
};

export const submitProfileData = async (
  accessToken: any,
  name: any,
  email: any,
  discordId: any
) => {
  const decoded: any = jwt_decode(accessToken);
  const dateNow = new Date();
  if (decoded.exp < dateNow.getTime() / 1000) {
    return new Error("Token expired!");
  }
  try {
    const profileDataSubmit = await fetch(
      `${backendDomain}/user/${decoded.id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: {
          name,
          email,
          discordId,
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.error(err);
      });
    return profileDataSubmit;
  } catch (error) {
    throw new Error("Something went wrong!");
  }
};
