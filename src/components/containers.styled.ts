import styled from "styled-components";

export const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const StyledWrap = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 600px;
  width: 500px;
  border-radius: 53px;
  align-items: center;
  text-align: center;
  padding: 30px;
  background: #fff;
  @media (min-width: 983px) and (max-width: 1280px) {
  }
  @media (min-width: 711px) and (max-width: 982px) {
  }
  @media (max-width: 710px) {
    height: 500px;
    width: 250px;
  }
`;

export const StyledVideo = styled.video`
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

export const StyledInfoWrapper = styled.div`
  font-family: "Roboto", sans-serif;
  font-size: 35px;
  padding-top: 50px;
  @media (min-width: 983px) and (max-width: 1280px) {
  }
  @media (min-width: 711px) and (max-width: 982px) {
  }
  @media (max-width: 710px) {
    font-size: 24px;
  }
`;
