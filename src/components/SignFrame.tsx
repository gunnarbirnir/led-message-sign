import React, {
  FC,
  PropsWithChildren,
  useMemo,
  useEffect,
  useRef,
} from "react";
import styled from "styled-components";

import { useSignContext } from "../hooks";
import { COLORS } from "../constants/colors";
import { FRAME_GLOW_HORIZONTAL_ANIMATION_CONTAINER_ID } from "../constants/animation";
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
  const frameVerticalLeftGlowRef = useRef<HTMLDivElement>(null);
  const frameVerticalRightGlowRef = useRef<HTMLDivElement>(null);

  const { config, computedValues, generateId } = useSignContext();
  const { id, height, width } = config;
  const {
    frameSize,
    pixelGridWidth,
    displayPaddingX,
    displayPaddingY,
    pixelGrid,
    pixelSize,
    pixelAreaWidth,
    pixelAreaHeight,
  } = computedValues;

  // TODO: Create hook
  const {
    frameGlowId,
    frameVerticalLeftGlowId,
    frameVerticalRightGlowId,
    frameMaskingId,
    frameShadingId,
    frameGlowHorizontalAnimationContainer,
  } = useMemo(
    () => ({
      frameGlowId: generateId("sign-frame-glow"),
      frameVerticalLeftGlowId: generateId("sign-frame-vertical-left-glow"),
      frameVerticalRightGlowId: generateId("sign-frame-vertical-right-glow"),
      frameMaskingId: generateId("sign-frame-masking"),
      frameShadingId: generateId("sign-frame-shading"),
      frameGlowHorizontalAnimationContainer: generateId(
        FRAME_GLOW_HORIZONTAL_ANIMATION_CONTAINER_ID
      ),
    }),
    [generateId]
  );
  const frameGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameGlowId, computedValues),
    [frameGlowId, computedValues]
  );
  const frameVerticalLeftGlowCanvasChunks = useMemo(
    () => getVerticalGlowCanvasChunks(frameVerticalLeftGlowId, computedValues),
    [frameVerticalLeftGlowId, computedValues]
  );
  const frameVerticalRightGlowCanvasChunks = useMemo(
    () => getVerticalGlowCanvasChunks(frameVerticalRightGlowId, computedValues),
    [frameVerticalRightGlowId, computedValues]
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

  useEffect(() => {
    let frameVerticalLeftGlowAnimation: Animation | null = null;

    if (frameVerticalLeftGlowRef.current) {
      const keyframes = {
        transform: [`translateX(-${pixelGrid.length * frameSize}px)`],
      };
      const options = {
        id: `frame-vertical-glow-animation-${id}`,
        duration: pixelGrid.length * 200,
        easing: `steps(${pixelGrid.length})`,
        iterations: Infinity,
      };

      frameVerticalLeftGlowAnimation = frameVerticalLeftGlowRef.current.animate(
        keyframes,
        options
      );
    }

    return () => {
      if (frameVerticalLeftGlowAnimation) {
        frameVerticalLeftGlowAnimation.cancel();
      }
    };
  }, [id, frameSize, pixelGrid.length, pixelSize]);

  useEffect(() => {
    let frameVerticalRightGlowAnimation: Animation | null = null;

    if (frameVerticalRightGlowRef.current) {
      const keyframes = {
        transform: [`translateX(-${pixelGrid.length * frameSize}px)`],
      };
      const options = {
        id: `frame-vertical-glow-animation-${id}`,
        duration: pixelGrid.length * 200,
        easing: `steps(${pixelGrid.length})`,
        iterations: Infinity,
      };

      frameVerticalRightGlowAnimation =
        frameVerticalRightGlowRef.current.animate(keyframes, options);
    }

    return () => {
      if (frameVerticalRightGlowAnimation) {
        frameVerticalRightGlowAnimation.cancel();
      }
    };
  }, [id, frameSize, pixelGrid.length, pixelSize]);

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
          id={frameGlowHorizontalAnimationContainer}
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
          ref={frameVerticalLeftGlowRef}
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
          ref={frameVerticalRightGlowRef}
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
