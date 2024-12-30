import React, { FC, useMemo, useEffect } from "react";
import styled from "styled-components";

import { useSignContext } from "../hooks";
import { getSignIds } from "../utils";
import { getCanvasContext, getCanvasChunks } from "../utils/canvas";
import { drawDisplayOffLights, drawDisplayOnLights } from "../utils/display";
import Canvas from "./Canvas";
import AnimationContainer from "./AnimationContainer";
import CanvasChunks from "./CanvasChunks";

const SignDisplay: FC = () => {
  const { config, computedValues, colors } = useSignContext();
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
    pixelCountX,
  } = computedValues;

  const { displayOnLightsId, displayOffLightsId, onLightsAnimationId } =
    useMemo(() => getSignIds(config.id), [config.id]);
  const onLightsCanvasChunks = useMemo(
    () => getCanvasChunks(displayOnLightsId, pixelSize, pixelGrid.length),
    [displayOnLightsId, pixelSize, pixelGrid.length]
  );
  const initPixelTransform = config.staticMode
    ? pixelSize * pixelCountX
    : undefined;

  useEffect(() => {
    const displayOffLightsCtx = getCanvasContext(displayOffLightsId);

    if (displayOffLightsCtx) {
      drawDisplayOffLights(displayOffLightsCtx, computedValues, colors);
    }
  }, [displayOffLightsId, computedValues, colors]);

  useEffect(() => {
    drawDisplayOnLights(onLightsCanvasChunks, computedValues, colors);
  }, [onLightsCanvasChunks, computedValues, colors]);

  return (
    <StyledSignDisplay
      style={{
        width: displayWidth,
        height: displayHeight,
        backgroundColor: colors.background.color,
      }}
    >
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
        <AnimationContainer
          id={onLightsAnimationId}
          width={pixelGridWidth}
          initTranslateX={initPixelTransform}
        >
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
