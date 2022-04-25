import { useState, useEffect, useCallback } from "react";
import { ConnectWalletButton } from "../components";

const GetStarted = () => {
  const [formData, setFormData] = useState({});
  const [selectedAddress, setSelectedAddress] = useState<string>();

  const addressChanged = useCallback((address: string | undefined) => {
    setSelectedAddress(address);
  }, []);

  useEffect(() => {
    if (formData) {
      console.log("formData from useEffect", formData);
      fetch("http://localhost:3001/user", {
        method: "POST",
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((result) =>
          console.log("stuff back from res is hardcoded :/", result)
        )
        .catch((error) => console.log("error", error));
    }
  }, [formData]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setFormData({
      userID: 1,
      name: event.target.name.value,
      walletID: selectedAddress,
      email: event.target.email.value,
      discordID: event.target.discordId.value,
      isFounder: event.target.isFounder.value,
    });
  };
  console.log("formData", formData);

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
      <ConnectWalletButton onChange={addressChanged} />
      <br />
      Are you a founder?
      <input type="radio" id="true" name="isFounder" value="true" />
      <label>yup</label>
      <input type="radio" id="css" name="isFounder" value="false" checked />
      <label>nope</label>
      <br />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default GetStarted;
