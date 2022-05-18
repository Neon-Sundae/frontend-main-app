import * as loginApi from "./../api/login";
import { useState, useEffect } from "react";

import PrimaryButton from "../components/buttons/primaryButton";
import StyledInfoBtn from "../components/buttons/infoButton";
import DiscordIcon from "../components/icons/discord";
import FoundersLabIcon from "../components/icons/founderslab";
import MetaMaskIcon from "../components/icons/metamask";
import SuccessIcon from "../components/icons/success";
import { StyledHeading } from "../components/partials.styled";
import { StyledContainer, StyledWrap } from "../components/containers.styled";
import { StyledVideo } from "../components/containers.styled";
import bgVideo from "./../assets/videos/bg.mp4";
import { StyledText } from "../components/partials.styled";
import { StyledInfoWrapper } from "../components/containers.styled";

const Login = () => {
  const [userAuthenticated, setUserAuthenticated] = useState<any>(false);

  useEffect(() => {
    setUserAuthenticated(localStorage.getItem("walletId"));
  }, []);

  const loginWithMetaMaskWallet = async () => {
    const walletId = await loginApi.connectToMetaMaskWallet();
    if (walletId) localStorage.setItem("walletId", walletId);
    const userData = await loginApi.fetchUserFromWalletId(walletId);
    const tokenData = await loginApi.generateAToken(userData);
    if (tokenData) setUserAuthenticated(walletId);
  };

  const connectToDiscord = () => {
    console.log("connect to discord");
  };

  return (
    <>
      <StyledVideo autoPlay muted loop id="bgvid">
        <source src={bgVideo} type="video/mp4" />
      </StyledVideo>
      <StyledContainer>
        <StyledWrap>
          <FoundersLabIcon />
          {!userAuthenticated ? (
            <>
              <StyledHeading>
                Welcome to Founders Lab, <br /> connect your wallet <br /> to
                get started.
              </StyledHeading>
              <PrimaryButton
                onClick={loginWithMetaMaskWallet}
                icon={<MetaMaskIcon />}
              >
                Metamask
              </PrimaryButton>
              <PrimaryButton
                onClick={connectToDiscord}
                disabled={true}
                icon={<DiscordIcon />}
              >
                Discord
              </PrimaryButton>
            </>
          ) : (
            <>
              <StyledInfoWrapper>
                <SuccessIcon />
                <p>Successful!</p>
              </StyledInfoWrapper>

              <StyledInfoBtn icon={<MetaMaskIcon />}>
                You're connected with &nbsp;
                {userAuthenticated.slice(0, 4) +
                  "..." +
                  userAuthenticated.slice(-5)}
              </StyledInfoBtn>
              <StyledText>
                Authentication is successful, wait for a few <br />
                seconds to automatically open dashboard.
              </StyledText>
            </>
          )}
        </StyledWrap>
      </StyledContainer>
    </>
  );
};

export default Login;
