import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as loginApi from "./../api/login";
import * as userApi from "./../api/user";
import PrimaryButton from "../components/buttons/primaryButton";
import FoundersLabIcon from "../components/icons/founderslab";
import { StyledHeading } from "../components/partials.styled";
import { StyledContainer, StyledWrap } from "../components/containers.styled";
import { StyledVideo } from "../components/containers.styled";
import bgVideo from "./../assets/videos/bg.mp4";
import {
  StyledForm,
  Container,
  StyledInput,
  Label,
} from "../components/forms/partials.styled";
import { StyledInfoWrapper } from "../components/containers.styled";
import SuccessIcon from "../components/icons/success";
import { StyledText } from "../components/partials.styled";

const NewUser = () => {
  const [submitted, setSubmitted] = useState<any>(false);
  const [discordData, setDiscordData] = useState<any>(false);
  const [userFormData, setUserFormData] = useState<any>({
    name: null,
    email: null,
  });
  const [userAuthenticated, setUserAuthenticated] = useState<any>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  let navigate = useNavigate();

  const url = window.location.href;
  let params = url.split("&");
  const discordAccessToken = params[1]?.split("=").pop();

  useEffect(() => {
    if (
      !localStorage.getItem("accessToken")?.length &&
      !localStorage.getItem("walletId")?.length &&
      !localStorage.getItem("state")
    ) {
      navigate("../login", { replace: true });
    }
    if (localStorage.getItem("submit")) {
      setSubmitted(true);
    }
    if (params[0].split("=").pop() === "access_denied") {
      navigate("../login", { replace: true });
    }
  }, []);

  useEffect(() => {
    if (submitted) {
      setTimeout(() => {
        navigate("../home", {
          replace: true,
        });
      }, 2000);
    }
  }, [submitted]);

  useEffect(() => {
    if (!discordData && discordAccessToken) {
      const fetchData = async () => {
        const fetchDiscordProfileData = await userApi.fetchDiscordProfile(
          discordAccessToken
        );
        setDiscordData(fetchDiscordProfileData);
      };
      fetchData();
    }
    if (discordData) {
      setValue("name", discordData.username);
      setValue("email", discordData.email);
    }
  }, [discordData]);

  const onSubmit = async (data: any) => {
    if (discordAccessToken) {
      let oldUserData: any;
      if (!localStorage.getItem("walletId")) {
        const walletId = await loginApi.connectToMetaMaskWallet();
        if (walletId) localStorage.setItem("walletId", walletId);
      }
      const userData = await loginApi.loginOrRegister(
        localStorage.getItem("walletId")
      );
      const tokenData = await loginApi.generateAToken(userData);
      if (tokenData) {
        localStorage.setItem("accessToken", tokenData.accessToken);
        loginApi.submitProfileData(
          tokenData.accessToken,
          data.name,
          data.email,
          discordData.id
        );
        const existingUserData: any = await userApi.fetchUserData(
          userData.id,
          tokenData.accessToken
        );
        setUserAuthenticated(localStorage.getItem("walletId"));
        if (existingUserData.email && existingUserData.name) {
          oldUserData = {
            email: existingUserData.email,
            name: existingUserData.name,
          };
          navigate("../home", {
            replace: true,
            state: { id: userData.id },
          });
        }
      }
      if (!oldUserData.email && !oldUserData.name) {
        navigate("../new-user", {
          replace: true,
          state: { id: userData.id },
        });
      }
    }
    if (!discordAccessToken) {
      const { name, email } = data;
      const accessToken: any = localStorage.getItem("accessToken");
      loginApi.submitProfileData(accessToken, name, email, "");
      localStorage.setItem("submit", "true");
      setSubmitted(true);
    }
  };
  return (
    <>
      <StyledVideo autoPlay muted loop id="bgvid">
        <source src={bgVideo} type="video/mp4" />
      </StyledVideo>
      <StyledContainer>
        <StyledWrap>
          <FoundersLabIcon />
          {userAuthenticated ? (
            <>
              <StyledInfoWrapper>
                <SuccessIcon />
                <p>Successful!</p>
              </StyledInfoWrapper>

              <StyledText>
                Authentication is successful, wait
                <br /> for a few seconds to automatically open <br />
                dashboard
              </StyledText>
            </>
          ) : (
            <>
              <StyledHeading>Create your profile</StyledHeading>
              <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <Container>
                  <StyledInput
                    {...register("name", {
                      required: true,
                      maxLength: 20,
                      pattern: /^([a-z0-9]|[-._](?![-._])){2,20}$/,
                    })}
                    className={errors.name ? "error" : ""}
                    defaultValue={
                      discordData?.username ? discordData.username : ""
                    }
                    onChange={(e) => {
                      errors.name = null;
                      setUserFormData({
                        ...userFormData,
                        ...{ name: e.target.value },
                      });
                    }}
                  />
                  <Label>Name</Label>
                </Container>
                <Container>
                  <StyledInput
                    {...register("email", {
                      required: true,
                      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    })}
                    className={errors.email ? "error" : ""}
                    defaultValue={discordData?.email ? discordData.email : " "}
                    onChange={(e) => {
                      errors.email = null;
                      setUserFormData({
                        ...userFormData,
                        ...{ email: e.target.value },
                      });
                    }}
                  />
                  <Label>Email</Label>
                </Container>
                <PrimaryButton
                  type="submit"
                  disabled={errors.name || errors.email}
                >
                  Let's get started!
                </PrimaryButton>
              </StyledForm>
            </>
          )}
        </StyledWrap>
      </StyledContainer>
    </>
  );
};

export default NewUser;
