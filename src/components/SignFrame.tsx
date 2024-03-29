import React, { FC, PropsWithChildren, useMemo, useEffect } from "react";
import styled from "styled-components";

import { useSignContext } from "../hooks";
import { COLORS } from "../constants/colors";
import { getSignIds } from "../utils";
import { getCanvasChunks, getCanvasContext } from "../utils/canvas";
import {
  drawFrameMasking,
  drawFrameShading,
  drawFrameHorizontalGlow,
  drawFrameVerticalGlow,
} from "../utils/frame";
import Canvas from "./Canvas";
import AnimationContainer from "./AnimationContainer";
import CanvasChunks from "./CanvasChunks";

const SignFrame: FC<PropsWithChildren> = ({ children }) => {
  const { config, computedValues } = useSignContext();
  const {
    signHeight,
    signWidth,
    pixelSize,
    frameSize,
    pixelGridWidth,
    displayPaddingX,
    displayPaddingY,
    pixelGrid,
    pixelAreaWidth,
    pixelAreaHeight,
  } = computedValues;

  const {
    frameHorizontalGlowId,
    frameLeftGlowId,
    frameRightGlowId,
    frameMaskingId,
    frameShadingId,
    horizontalGlowAnimationId,
    leftGlowAnimationId,
    rightGlowAnimationId,
  } = useMemo(() => getSignIds(config.id), [config.id]);

  const horizontalGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameHorizontalGlowId, pixelSize, pixelGrid.length),
    [frameHorizontalGlowId, pixelSize, pixelGrid.length]
  );
  const leftGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameLeftGlowId, frameSize, pixelGrid.length),
    [frameLeftGlowId, frameSize, pixelGrid.length]
  );
  const rightGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameRightGlowId, frameSize, pixelGrid.length),
    [frameRightGlowId, frameSize, pixelGrid.length]
  );
  const verticalGlowStyle = useMemo(
    () => ({
      top: frameSize + displayPaddingY,
      width: frameSize,
      height: pixelAreaHeight,
    }),
    [frameSize, displayPaddingY, pixelAreaHeight]
  );

  useEffect(() => {
    const frameMaskingCtx = getCanvasContext(frameMaskingId, true);
    const frameShadingCtx = getCanvasContext(frameShadingId, true);

    if (frameMaskingCtx) {
      drawFrameMasking(frameMaskingCtx, computedValues);
    }
    if (frameShadingCtx) {
      drawFrameShading(frameShadingCtx, computedValues);
    }
  }, [frameMaskingId, frameShadingId, computedValues]);

  useEffect(() => {
    drawFrameHorizontalGlow(horizontalGlowCanvasChunks, computedValues, config);
    drawFrameVerticalGlow(leftGlowCanvasChunks, computedValues, config);
    drawFrameVerticalGlow(
      rightGlowCanvasChunks,
      computedValues,
      config,
      "right"
    );
  }, [
    computedValues,
    config,
    horizontalGlowCanvasChunks,
    leftGlowCanvasChunks,
    rightGlowCanvasChunks,
  ]);

  return (
    <StyledSignFrame style={{ height: signHeight, width: signWidth }}>
      <HorizontalGlow
        style={{
          height: signHeight,
          width: pixelAreaWidth,
          left: frameSize + displayPaddingX,
        }}
      >
        <AnimationContainer
          id={horizontalGlowAnimationId}
          width={pixelGridWidth}
        >
          <CanvasChunks
            chunks={horizontalGlowCanvasChunks}
            height={signHeight}
          />
        </AnimationContainer>
      </HorizontalGlow>

      <VerticalGlow style={{ ...verticalGlowStyle, left: 0 }}>
        <AnimationContainer
          id={leftGlowAnimationId}
          width={pixelGrid.length * frameSize}
        >
          <CanvasChunks
            chunks={leftGlowCanvasChunks}
            height={pixelAreaHeight}
          />
        </AnimationContainer>
      </VerticalGlow>

      <VerticalGlow
        style={{ ...verticalGlowStyle, left: signWidth - frameSize }}
      >
        <AnimationContainer
          id={rightGlowAnimationId}
          width={pixelGrid.length * frameSize}
        >
          <CanvasChunks
            chunks={rightGlowCanvasChunks}
            height={pixelAreaHeight}
          />
        </AnimationContainer>
      </VerticalGlow>

      <FrameLayer id={frameMaskingId} height={signHeight} width={signWidth} />
      <FrameLayer id={frameShadingId} height={signHeight} width={signWidth} />
      <SignContent style={{ top: frameSize, left: frameSize }}>
        {children}
      </SignContent>
    </StyledSignFrame>
  );
};

const StyledSignFrame = styled.div`
  position: relative;
  background-color: ${COLORS.FRAME};
`;

const HorizontalGlow = styled.div`
  position: absolute;
  top: 0;
  overflow: hidden;
`;

const VerticalGlow = styled.div`
  position: absolute;
  overflow: hidden;
`;

const FrameLayer = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
`;

const SignContent = styled.div`
  position: absolute;
`;

export default SignFrame;
