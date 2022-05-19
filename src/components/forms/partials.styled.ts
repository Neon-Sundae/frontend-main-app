import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  color: #878787;
  border-radius: 3px;
  @media (min-width: 983px) and (max-width: 1280px) {
  }
  @media (min-width: 711px) and (max-width: 982px) {
  }
  @media (max-width: 710px) {
  }
`;
export const Label = styled.label`
  font-family: "Roboto";
  font-size: 18px;
  font-weight: 400;
  text-align: left;
  line-height: 20px;
  margin-bottom: 10px;
  &.error {
    color: #f88379 !important;
  }
`;

export const StyledInput = styled.input`
  border: none;
  outline: 0;
  height: 60px;
  font-size: 18px;
  font-weight: 400;
  padding: 0 10px;
  background: #f1f1f1;
  border-radius: 15px;
  margin-bottom: 40px;
  &.error {
    border: 2px solid #f88379 !important;
  }
`;

export const StyledForm = styled.form`
  width: 425px;
  @media (max-width: 710px) {
    width: 200px;
  }
`;
