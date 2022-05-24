const backendDomain = import.meta.env.VITE_BACKEND_DOMAIN;

export const fetchUserData = async (userId: any, accessToken: any) => {
  try {
    const fetchedUser = await fetch(`${backendDomain}/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.error(err);
      });
    return fetchedUser;
  } catch (error) {
    throw new Error("You need to sign in.");
  }
};

export const fetchDiscordProfile = async function name(
  discordAccessToken: any
) {
  try {
    const discordUserData = fetch("https://discordapp.com/api/users/@me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${discordAccessToken}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.error(err);
      });
    return discordUserData;
  } catch {
    throw new Error("Something went wrong.");
  }
};
