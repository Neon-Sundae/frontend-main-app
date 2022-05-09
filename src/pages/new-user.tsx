import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>();

  useEffect(() => {
    if (formData) {
      const options = {
        method: "POST",
        url: "http://localhost:3001/user",
        headers: { "Content-Type": "application/json" },
        data: {
          name: formData.name,
          walletId: selectedAddress.toLowerString(),
          email: formData.email,
          discordID: formData.discordID,
          isFounder: formData.isFounder,
        },
      };
      axios
        .request(options)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  }, [formData]);

  const handleWalletConnect = (e: any) => {
    e.preventDefault();
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result: any) => {
        const options = {
          method: "GET",
          url: "http://localhost:3001/auth/verify-walletid",
          headers: {
            "Content-Type": "application/json",
            walletId: result[0].toLowerCase(),
          },
        };
        axios
          .request(options)
          .then(function (response) {
            console.log(response.data);
            if (!response.data.length) {
              setSelectedAddress(result[0]);
            } else {
              alert("you're already registered!");
              navigate("../login", { replace: true });
            }
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch((err: any) => {
        console.log("err", err);
      });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setFormData({
      name: event.target.name.value,
      walletID: selectedAddress?.toLowerCase(),
      email: event.target.email.value,
      discordID: event.target.discordId.value,
      isFounder: event.target.isFounder.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" />
      </label>{" "}
      <br />
      <label>
        Email:
        <input type="email" name="email" />
      </label>
      <br />
      <label>
        Discord id:
        <input type="text" name="discordId" />
      </label>
      <br />
      <button
        onClick={(e) => {
          handleWalletConnect(e);
        }}
        disabled={selectedAddress}
      >
        {selectedAddress
          ? `wallet address: ${selectedAddress}`
          : "connect wallet"}
      </button>
      <br />
      Are you a founder?
      <input type="radio" id="true" name="isFounder" value="true" />
      <label>yes</label>
      <input type="radio" id="css" name="isFounder" value="false" checked />
      <label>no</label>
      <br />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default NewUser;
