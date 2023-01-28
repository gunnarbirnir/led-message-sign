import React, { FC } from "react";
import styled from "styled-components";

import LEDMessageSign from "../components/LEDMessageSign";
import { LEDMessageSignProps } from "../types";
import { DEFAULT_VALUE, MIN_VALUE, MAX_VALUE } from "../constants/props";

// Doesn't work for now, link in other project instead
// Or move add peerDependencies to devDependencies
// TODO: Delete?

export default {
  title: "LEDMessageSign",
  component: LEDMessageSign,
  argTypes: {
    text: { defaultValue: "Test" },
    height: {
      defaultValue: DEFAULT_VALUE.HEIGHT,
      control: {
        type: "number",
        min: MIN_VALUE.HEIGHT,
      },
    },
    width: {
      defaultValue: DEFAULT_VALUE.WIDTH,
      control: {
        type: "number",
        min: MIN_VALUE.WIDTH,
      },
    },
    fullWidth: { defaultValue: DEFAULT_VALUE.FULL_WIDTH },
    colorHue: {
      defaultValue: DEFAULT_VALUE.COLOR_HUE,
      control: {
        type: "number",
        min: MIN_VALUE.COLOR_HUE,
        max: MAX_VALUE.COLOR_HUE,
      },
    },
    hideFrame: { defaultValue: DEFAULT_VALUE.HIDE_FRAME },
    coloredOffLights: { defaultValue: DEFAULT_VALUE.COLORED_OFF_LIGHTS },
    animationFramesPerUpdate: {
      defaultValue: DEFAULT_VALUE.ANIMATION_FRAMES_PER_UPDATE,
      control: {
        type: "number",
        min: MIN_VALUE.ANIMATION_FRAMES_PER_UPDATE,
      },
    },
  },
};

export const Default: FC<LEDMessageSignProps> = (props) => (
  <LEDMessageSignContainer>
    <LEDMessageSign {...props} />
  </LEDMessageSignContainer>
);

const LEDMessageSignContainer = styled.div`
  height: 100vh;
  width: 100%;
  background-color: hsl(0, 0%, 0%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
