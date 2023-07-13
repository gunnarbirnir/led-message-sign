import React, { FC, useMemo, useEffect, useRef } from "react";
import styled from "styled-components";

import { useSignContext } from "../hooks";
import {
  getCanvasContext,
  drawDisplayOffLights,
  getOnLightsImageChunks,
  drawDisplayOnLights,
} from "../utils/canvas";
import { COLORS } from "../constants/colors";
import Canvas from "./Canvas";

const SignDisplay: FC = () => {
  const onLightsRef = useRef<HTMLDivElement>(null);
  const { config, computedValues } = useSignContext();
  const { id } = config;
  const {
    displayWidth,
    displayHeight,
    pixelAreaHeight,
    pixelAreaWidth,
    displayPaddingX,
    displayPaddingY,
    imageWidth,
    pixelSize,
    pixelGrid,
  } = computedValues;

  const { displayOnLightsId, displayOffLightsId } = useMemo(
    () => ({
      displayOnLightsId: `sign-display-on-lights-${id}`,
      displayOffLightsId: `sign-display-off-lights-${id}`,
    }),
    [id]
  );
  const onLightsImageChunks = useMemo(
    () => getOnLightsImageChunks(displayOnLightsId, computedValues),
    [displayOnLightsId, computedValues]
  );

  useEffect(() => {
    const displayOffLightsCtx = getCanvasContext(displayOffLightsId);

    if (displayOffLightsCtx) {
      drawDisplayOffLights(displayOffLightsCtx, computedValues, config);
    }
  }, [displayOffLightsId, displayOnLightsId, computedValues, config]);

  useEffect(() => {
    drawDisplayOnLights(onLightsImageChunks, computedValues, config);
  }, [computedValues, onLightsImageChunks, config]);

  useEffect(() => {
    let onLightsAnimation: Animation | null = null;

    if (onLightsRef.current) {
      const keyframes = {
        transform: [`translateX(-${pixelGrid.length * pixelSize}px)`],
      };
      const options = {
        id: "on-lights-animation",
        duration: pixelGrid.length * 200,
        easing: `steps(${pixelGrid.length})`,
        iterations: Infinity,
      };

      onLightsAnimation = onLightsRef.current.animate(keyframes, options);
    }

    return () => {
      if (onLightsAnimation) {
        onLightsAnimation.cancel();
      }
    };
  }, [pixelGrid.length, pixelSize]);

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
        <div ref={onLightsRef} style={{ width: imageWidth }}>
          {onLightsImageChunks.map((chunk) => (
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
