import axios from "axios";

const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;

export const fetchUserData = async (userId: any, accessToken: any) => {
  const options = {
    method: "GET",
    url: `${backendDomain}/user/${userId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const fetchedUserData = axios
      .request(options)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
      });
    return fetchedUserData;
  } catch {
    throw new Error("You need to sign the message to be able to log in.");
  }
};
