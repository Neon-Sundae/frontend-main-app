import styled from "styled-components";

export const StyledPrimaryButton = styled.button`
  border: 0;
  background: #504b64;
  color: #fff;
  border-radius: 30px;
  width: 100%;
  margin-bottom: 25px;
  height: 80px;
  cursor: pointer;
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  :disabled {
    background: #ebebe4;
    cursor: auto;
  }
  @media (min-width: 983px) and (max-width: 1280px) {
  }
  @media (min-width: 711px) and (max-width: 982px) {
  }
  @media (max-width: 710px) {
    height: 40px;
    font-size: 18px;
  }
`;

export const StyledInformationButton = styled.button`
  background: #fff;
  color: #504b64;
  border-radius: 30px;
  width: 85%;
  margin-bottom: 25px;
  height: 86px;
  font-family: "Roboto", sans-serif;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 983px) and (max-width: 1280px) {
  }
  @media (min-width: 711px) and (max-width: 982px) {
  }
  @media (max-width: 710px) {
    height: 40px;
    width: 99%;
    font-size: 12px;
    & svg {
    }
  }
`;
