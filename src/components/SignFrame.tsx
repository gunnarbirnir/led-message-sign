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
import {
  getCanvasChunks,
  getCanvasContext,
  drawFrameMasking,
  drawFrameShading,
  drawFrameGlow,
} from "../utils/canvas";
import Canvas from "./Canvas";

const SignFrame: FC<PropsWithChildren> = ({ children }) => {
  const frameGlowRef = useRef<HTMLDivElement>(null);
  const { config, computedValues } = useSignContext();
  const { id, height, width } = config;
  const {
    frameSize,
    pixelGridWidth,
    displayPaddingX,
    pixelGrid,
    pixelSize,
    pixelAreaWidth,
  } = computedValues;

  const { frameGlowId, frameMaskingId, frameShadingId } = useMemo(
    () => ({
      frameGlowId: `sign-frame-glow-${id}`,
      frameMaskingId: `sign-frame-masking-${id}`,
      frameShadingId: `sign-frame-shading-${id}`,
    }),
    [id]
  );
  const frameGlowCanvasChunks = useMemo(
    () => getCanvasChunks(frameGlowId, computedValues),
    [frameGlowId, computedValues]
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
  }, [frameGlowCanvasChunks, computedValues, config]);

  useEffect(() => {
    let frameGlowAnimation: Animation | null = null;

    if (frameGlowRef.current) {
      const keyframes = {
        transform: [`translateX(-${pixelGrid.length * pixelSize}px)`],
      };
      const options = {
        id: `frame-glow-animation-${id}`,
        duration: pixelGrid.length * 200,
        easing: `steps(${pixelGrid.length})`,
        iterations: Infinity,
      };

      frameGlowAnimation = frameGlowRef.current.animate(keyframes, options);
    }

    return () => {
      if (frameGlowAnimation) {
        frameGlowAnimation.cancel();
      }
    };
  }, [id, pixelGrid.length, pixelSize]);

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
        <div ref={frameGlowRef} style={{ width: pixelGridWidth }}>
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

const SignContent = styled.div`
  position: absolute;
`;

export default SignFrame;
