import React, { FC, useMemo, useEffect } from "react";
import styled from "styled-components";

import { useSignContext } from "../hooks";
import { getSignIds } from "../utils";
import { getCanvasContext, getCanvasChunks } from "../utils/canvas";
import { drawDisplayOffLights, drawDisplayOnLights } from "../utils/display";
import { COLORS } from "../constants/colors";
import Canvas from "./Canvas";
import AnimationContainer from "./AnimationContainer";
import CanvasChunks from "./CanvasChunks";

const SignDisplay: FC = () => {
  const { config, computedValues } = useSignContext();
  const {
    pixelSize,
    displayWidth,
    displayHeight,
    pixelAreaHeight,
    pixelAreaWidth,
    displayPaddingX,
    displayPaddingY,
    pixelGrid,
    pixelGridWidth,
  } = computedValues;

  const { displayOnLightsId, displayOffLightsId, onLightsAnimationId } =
    useMemo(() => getSignIds(config.id), [config.id]);
  const onLightsCanvasChunks = useMemo(
    () => getCanvasChunks(displayOnLightsId, pixelSize, pixelGrid.length),
    [displayOnLightsId, pixelSize, pixelGrid.length]
  );

  useEffect(() => {
    const displayOffLightsCtx = getCanvasContext(displayOffLightsId);

    if (displayOffLightsCtx) {
      drawDisplayOffLights(displayOffLightsCtx, computedValues, config);
    }
  }, [displayOffLightsId, computedValues, config]);

  useEffect(() => {
    drawDisplayOnLights(onLightsCanvasChunks, computedValues, config);
  }, [onLightsCanvasChunks, computedValues, config]);

  return (
    <StyledSignDisplay style={{ width: displayWidth, height: displayHeight }}>
      <OffPixels
        id={displayOffLightsId}
        height={displayHeight}
        width={displayWidth}
      />
      <OnPixels
        style={{
          top: displayPaddingY,
          left: displayPaddingX,
          height: pixelAreaHeight,
          width: pixelAreaWidth,
        }}
      >
        <AnimationContainer id={onLightsAnimationId} width={pixelGridWidth}>
          <CanvasChunks
            chunks={onLightsCanvasChunks}
            height={pixelAreaHeight}
          />
        </AnimationContainer>
      </OnPixels>
    </StyledSignDisplay>
  );
};

const StyledSignDisplay = styled.div`
  position: relative;
  background-color: ${COLORS.BACKGROUND};
`;

const OffPixels = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
`;

const OnPixels = styled.div`
  position: absolute;
  overflow: hidden;
`;

export default SignDisplay;
