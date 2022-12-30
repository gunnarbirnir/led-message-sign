import { FC } from "react";
import styled from "styled-components";

import { COLORS } from "../constants/colors";

const SignDisplay: FC = () => {
  return <StyledSignDisplay />;
};

const StyledSignDisplay = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background-color: ${COLORS.BACKGROUND};
`;

export default SignDisplay;
