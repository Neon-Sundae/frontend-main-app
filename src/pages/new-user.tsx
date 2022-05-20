import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as loginApi from "./../api/login";
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
  let navigate = useNavigate();
  useEffect(() => {
    if (
      !localStorage.getItem("accessToken") ||
      !localStorage.getItem("walletId")
    ) {
      if (confirm("You need to login!") == true) {
        navigate("../login", { replace: true });
      }
    }
    if (localStorage.getItem("submit")) {
      setSubmitted(true);
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    const { name, email } = data;
    const accessToken: any = localStorage.getItem("accessToken");
    loginApi.submitProfileData(accessToken, name, email);
    localStorage.setItem("submit", "true");
    setSubmitted(true);
  };

  return (
    <>
      <StyledVideo autoPlay muted loop id="bgvid">
        <source src={bgVideo} type="video/mp4" />
      </StyledVideo>
      <StyledContainer>
        <StyledWrap>
          <FoundersLabIcon />
          {submitted ? (
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
              {" "}
              <StyledHeading>Create your profile</StyledHeading>
              <StyledForm onSubmit={handleSubmit(onSubmit)}>
                <Container>
                  <StyledInput
                    {...register("name", {
                      required: true,
                      maxLength: 20,
                      pattern: /^([a-z]|[](?![])){2,20}$/,
                    })}
                    className={errors.name ? "error" : ""}
                    placeholder={errors.name ? "invalid username" : ""}
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
                    placeholder={errors.email ? "invalid email" : ""}
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
