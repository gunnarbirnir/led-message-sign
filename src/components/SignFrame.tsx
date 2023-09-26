import React, { FC, PropsWithChildren, useMemo, useEffect } from "react";
import styled from "styled-components";

import { useSignContext, useSignIds } from "../hooks";
import { COLORS } from "../constants/colors";
import {
  getCanvasChunks,
  getVerticalGlowCanvasChunks,
  getCanvasContext,
  drawFrameMasking,
  drawFrameShading,
  drawFrameGlow,
  drawFrameVerticalGlow,
} from "../utils/canvas";
import Canvas from "./Canvas";

const SignFrame: FC<PropsWithChildren> = ({ children }) => {
  const { config, computedValues } = useSignContext();
  const { height, width } = config;
  const {
    frameSize,
    pixelGridWidth,
    displayPaddingX,
    displayPaddingY,
    pixelGrid,
    pixelAreaWidth,
    pixelAreaHeight,
  } = computedValues;

  const {
    frameGlowHorizontalId,
    frameGlowVerticalLeftId,
    frameGlowVerticalRightId,
    frameMaskingId,
    frameShadingId,
    frameGlowHorizontalAnimationContainerId,
    frameGlowVerticalLeftAnimationContainerId,
    frameGlowVerticalRightAnimationContainerId,
  } = useSignIds();
  const frameGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameGlowHorizontalId, computedValues),
    [frameGlowHorizontalId, computedValues]
  );
  const frameVerticalLeftGlowCanvasChunks = useMemo(
    () => getVerticalGlowCanvasChunks(frameGlowVerticalLeftId, computedValues),
    [frameGlowVerticalLeftId, computedValues]
  );
  const frameVerticalRightGlowCanvasChunks = useMemo(
    () => getVerticalGlowCanvasChunks(frameGlowVerticalRightId, computedValues),
    [frameGlowVerticalRightId, computedValues]
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
    drawFrameGlow(frameGlowCanvasChunks, computedValues, config);
    drawFrameVerticalGlow(
      frameVerticalLeftGlowCanvasChunks,
      computedValues,
      config
    );
    drawFrameVerticalGlow(
      frameVerticalRightGlowCanvasChunks,
      computedValues,
      config,
      "right"
    );
  }, [
    frameGlowCanvasChunks,
    frameVerticalLeftGlowCanvasChunks,
    frameVerticalRightGlowCanvasChunks,
    computedValues,
    config,
  ]);

  if (!width) {
    return null;
  }

  return (
    <StyledSignFrame style={{ height, width }}>
      <FrameGlow
        style={{
          height,
          width: pixelAreaWidth,
          left: frameSize + displayPaddingX,
        }}
      >
        <div
          id={frameGlowHorizontalAnimationContainerId}
          style={{ width: pixelGridWidth }}
        >
          {frameGlowCanvasChunks.map((chunk) => (
            <Canvas
              id={chunk.id}
              key={chunk.id}
              height={height}
              width={chunk.end - chunk.start}
            />
          ))}
        </div>
      </FrameGlow>
      <FrameVerticalGlow
        style={{
          top: frameSize + displayPaddingY,
          left: 0,
          width: frameSize,
          height: pixelAreaHeight,
        }}
      >
        <div
          id={frameGlowVerticalLeftAnimationContainerId}
          style={{ width: pixelGrid.length * frameSize }}
        >
          {frameVerticalLeftGlowCanvasChunks.map((chunk) => (
            <Canvas
              id={chunk.id}
              key={chunk.id}
              height={pixelAreaHeight}
              width={chunk.end - chunk.start}
            />
          ))}
        </div>
      </FrameVerticalGlow>
      <FrameVerticalGlow
        style={{
          top: frameSize + displayPaddingY,
          left: width - frameSize,
          width: frameSize,
          height: pixelAreaHeight,
        }}
      >
        <div
          id={frameGlowVerticalRightAnimationContainerId}
          style={{ width: pixelGrid.length * frameSize }}
        >
          {frameVerticalRightGlowCanvasChunks.map((chunk) => (
            <Canvas
              id={chunk.id}
              key={chunk.id}
              height={pixelAreaHeight}
              width={chunk.end - chunk.start}
            />
          ))}
        </div>
      </FrameVerticalGlow>
      <FrameLayer id={frameMaskingId} height={height} width={width} />
      <FrameLayer id={frameShadingId} height={height} width={width} />
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

const FrameLayer = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
`;

const FrameGlow = styled.div`
  position: absolute;
  top: 0;
  overflow: hidden;

  & > div {
    display: flex;
    flex-direction: row;
  }
`;

const FrameVerticalGlow = styled.div`
  position: absolute;
  overflow: hidden;

  & > div {
    display: flex;
    flex-direction: row;
  }
`;

const SignContent = styled.div`
  position: absolute;
`;

export default SignFrame;
