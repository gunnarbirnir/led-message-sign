import React, { FC, useMemo, useEffect } from "react";
import styled from "styled-components";

import { useSignContext, useSignIds } from "../hooks";
import {
  getCanvasContext,
  drawDisplayOffLights,
  getCanvasChunks,
  drawDisplayOnLights,
} from "../utils/canvas";
import { COLORS } from "../constants/colors";
import Canvas from "./Canvas";

const SignDisplay: FC = () => {
  const { config, computedValues } = useSignContext();
  const {
    displayWidth,
    displayHeight,
    pixelAreaHeight,
    pixelAreaWidth,
    displayPaddingX,
    displayPaddingY,
    pixelGridWidth,
  } = computedValues;

  const {
    displayOnLightsId,
    displayOffLightsId,
    onLightsAnimationContainerId,
  } = useSignIds();
  const onLightsCanvasChunks = useMemo(
    () => getCanvasChunks(displayOnLightsId, computedValues),
    [displayOnLightsId, computedValues]
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
        <div
          id={onLightsAnimationContainerId}
          style={{ width: pixelGridWidth }}
        >
          {onLightsCanvasChunks.map((chunk) => (
            <Canvas
              id={chunk.id}
              key={chunk.id}
              height={pixelAreaHeight}
              width={chunk.end - chunk.start}
            />
          ))}
        </div>
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

  & > div {
    display: flex;
    flex-direction: row;
  }
`;

export default SignDisplay;
