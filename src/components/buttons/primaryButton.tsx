import React from "react";
import { StyledPrimaryButton } from "./buttons.styled";

const PrimaryButton = React.forwardRef((props: any, ref: any) => {
  return (
    <>
      <StyledPrimaryButton
        onClick={props.onClick}
        type={props.type}
        disabled={props.disabled}
      >
        {props.icon} &nbsp; &nbsp;
        {props.children}
      </StyledPrimaryButton>
    </>
  );
});

export default PrimaryButton;
