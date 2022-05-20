import styled from "styled-components";

export const StyledHeading = styled.p`
  font-family: "Roboto", sans-serif;
  font-size: 35px;
  line-height: 40px;
  padding-top: 30px;
  padding-bottom: 50px;
  @media (min-width: 983px) and (max-width: 1280px) {
  }
  @media (min-width: 711px) and (max-width: 982px) {
  }
  @media (max-width: 710px) {
    line-height: 35px;
    padding-top: 40%;
    font-size: 25px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
`;

export const StyledText = styled.p`
  font-family: "Roboto", sans-serif;
  line-height: 32px;
  font-size: 18px;
  @media (min-width: 983px) and (max-width: 1280px) {
  }
  @media (min-width: 711px) and (max-width: 982px) {
  }
  @media (max-width: 710px) {
    font-size: 16px;
    line-height: 20px;
  }
`;
