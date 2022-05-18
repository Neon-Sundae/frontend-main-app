import React from "react";
import { StyledInformationButton } from "./buttons.styled";

const StyledInfoBtn = React.forwardRef((props: any, ref: any) => {
  return (
    <>
      <StyledInformationButton
        onClick={props.onClick}
        type={props.type}
        disabled={props.disabled}
      >
        {props.icon} &nbsp; &nbsp;
        {props.children}
      </StyledInformationButton>
    </>
  );
});

export default StyledInfoBtn;
