/* eslint-disable react/jsx-no-useless-fragment */
import { useState, useEffect } from 'react';
import { Background, LoginContainer } from 'components/Login';

const Login = () => {
  // const [userAuthenticated, setUserAuthenticated] = useState<any>(false);
  // const [authData, setAuthData] = useState<any>({
  //   at: null,
  //   walletId: null,
  // });

  // const navigate = useNavigate();

  // useEffect(() => {
  //   const walletId = localStorage.getItem('walletId');
  //   setUserAuthenticated(walletId);
  //   const accessToken = localStorage.getItem('accessToken');
  //   if (walletId?.length && accessToken?.length)
  //     setTimeout(() => {
  //       navigate('../new-user', { replace: true });
  //     }, 2000);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const loginWithMetaMaskWallet = async () => {
  //   let oldUserData: any;
  //   const walletId = await loginApi.connectToMetaMaskWallet();
  //   if (walletId) localStorage.setItem('walletId', walletId);
  //   const userData = await loginApi.loginOrRegister(walletId);
  //   const tokenData = await loginApi.generateAToken(userData);
  //   console.log(tokenData);
  //   if (tokenData) {
  //     localStorage.setItem('accessToken', tokenData.accessToken);
  //     const existingUserData: any = await userApi.fetchUserData(
  //       userData.id,
  //       tokenData.accessToken
  //     );
  //     setUserAuthenticated(walletId);
  //     if (existingUserData && existingUserData.email && existingUserData.name) {
  //       oldUserData = {
  //         email: existingUserData.email,
  //         name: existingUserData.name,
  //       };
  //       navigate('../home', {
  //         replace: true,
  //         state: { id: userData.data.id },
  //       });
  //     }
  //   }
  //   if (!oldUserData.email && !oldUserData.name) {
  //     navigate('../new-user', {
  //       replace: true,
  //       state: { id: userData.id },
  //     });
  //   }
  // };

  // const connectToDiscord = () => {
  //   const state: any = Math.floor(Math.random() * 1000000);
  //   localStorage.setItem('state', state);
  //   const discordClientID = import.meta.env.VITE_DISCORD_CLIENT_ID;
  //   window.open(
  //     `https://discord.com/api/oauth2/authorize?response_type=token&client_id=${discordClientID}&state=${state}&scope=identify%20email`,
  //     '_self'
  //   );
  // };

  return (
    <>
      <Background />
      <LoginContainer />
    </>
  );

  //   return (
  //     <StyledContainer>
  //       <StyledWrap>
  //         <FoundersLabIcon width={227} height={29} />
  //         {!userAuthenticated ? (
  //           <>
  //             <StyledHeading>
  //               Welcome to Founders Lab, <br /> connect your wallet <br /> to get
  //               started.
  //             </StyledHeading>
  //             <PrimaryButton
  //               onClick={loginWithMetaMaskWallet}
  //               icon={<MetamaskIcon width={39} height={35} />}
  //             >
  //               Metamask
  //             </PrimaryButton>
  //             <PrimaryButton
  //               onClick={connectToDiscord}
  //               icon={<DiscordIcon width={39} height={35} />}
  //             >
  //               Discord
  //             </PrimaryButton>
  //           </>
  //         ) : (
  //           <>
  //             <StyledInfoWrapper>
  //               <SuccessIcon width={128} height={128} />
  //               <p>Successful!</p>
  //             </StyledInfoWrapper>

  //             <StyledInfoBtn icon={<MetamaskIcon width={39} height={35} />}>
  //               You&apos;re connected with &nbsp;
  //               {`${userAuthenticated.slice(0, 4)}...${userAuthenticated.slice(
  //                 -5
  //               )}`}
  //             </StyledInfoBtn>
  //             <StyledText>
  //               Authentication is successful, wait for a few <br />
  //               seconds to automatically open dashboard.
  //             </StyledText>
  //           </>
  //         )}
  //       </StyledWrap>
  //     </StyledContainer>
  //   );
};

export default Login;
