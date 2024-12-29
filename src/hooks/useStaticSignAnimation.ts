import { useEffect, useMemo, useCallback, useState } from "react";

import { SignConfig, SignComputedValues } from "../types";
import { FRAME_DURATION } from "../constants";
import { getSignIds } from "../utils";
import { syncAnimations } from "../utils/animations";

const useStaticSignAnimation = (
  { id, animationFramesPerUpdate, staticMode, staticModeDelay }: SignConfig,
  { pixelSize, pixelGrid, frameSize, pixelCountX }: SignComputedValues,
  {
    updateAnimationId,
  }: { onAnimationFinished?: () => void; updateAnimationId?: string }
) => {
  const [activeAnimationIndex, setActiveAnimationIndex] = useState(0);
  const updateDuration = useMemo(
    () => FRAME_DURATION * animationFramesPerUpdate,
    [animationFramesPerUpdate]
  );
  const initAnimationOptions = useMemo(
    () => ({
      duration: staticModeDelay,
      iterations: 1,
      fill: "both" as FillMode,
    }),
    [staticModeDelay]
  );
  const animationOptions = useMemo(
    () => ({
      duration: pixelGrid.length * updateDuration,
      easing: `steps(${pixelGrid.length})`,
      iterations: 1,
      fill: "both" as FillMode,
    }),
    [pixelGrid.length, updateDuration]
  );

  const calcInitKeyframes = useCallback(
    (itemSize: number) => [
      { transform: `translateX(-${itemSize * pixelCountX}px)` },
      { transform: `translateX(-${itemSize * pixelCountX}px)` },
    ],
    [pixelCountX]
  );
  const calcKeyframes = useCallback(
    (itemSize: number) => [
      { transform: `translateX(-${itemSize * pixelCountX}px)` },
      {
        transform: `translateX(-${itemSize * pixelGrid.length}px)`,
        offset: (pixelGrid.length - pixelCountX) / pixelGrid.length,
      },
      {
        transform: `translateX(0px)`,
        offset: (pixelGrid.length - pixelCountX) / pixelGrid.length,
      },
      { transform: `translateX(-${itemSize * pixelCountX}px)` },
    ],
    [pixelCountX, pixelGrid.length]
  );

  const initPixelKeyframes = useMemo(
    () => calcInitKeyframes(pixelSize),
    [calcInitKeyframes, pixelSize]
  );
  const initFrameKeyframes = useMemo(
    () => calcInitKeyframes(frameSize),
    [calcInitKeyframes, frameSize]
  );
  const pixelKeyframes = useMemo(
    () => calcKeyframes(pixelSize),
    [calcKeyframes, pixelSize]
  );
  const frameKeyframes = useMemo(
    () => calcKeyframes(frameSize),
    [calcKeyframes, frameSize]
  );

  useEffect(() => {
    if (!staticMode) {
      return;
    }

    const initAnimation = activeAnimationIndex === 0;
    const {
      onLightsAnimationId,
      horizontalGlowAnimationId,
      leftGlowAnimationId,
      rightGlowAnimationId,
    } = getSignIds(id);

    const onLightsElement = document.getElementById(onLightsAnimationId);
    const horizontalGlowElement = document.getElementById(
      horizontalGlowAnimationId
    );
    const leftGlowElement = document.getElementById(leftGlowAnimationId);
    const rightGlowElement = document.getElementById(rightGlowAnimationId);

    let onLightsAnimation: Animation | null = null;
    let horizontalGlowAnimation: Animation | null = null;
    let leftGlowAnimation: Animation | null = null;
    let rightGlowAnimation: Animation | null = null;

    if (onLightsElement) {
      onLightsAnimation = initAnimation
        ? onLightsElement.animate(initPixelKeyframes, initAnimationOptions)
        : onLightsElement.animate(pixelKeyframes, animationOptions);
    }

    if (horizontalGlowElement) {
      horizontalGlowAnimation = initAnimation
        ? horizontalGlowElement.animate(
            initPixelKeyframes,
            initAnimationOptions
          )
        : horizontalGlowElement.animate(pixelKeyframes, animationOptions);
    }

    if (leftGlowElement) {
      leftGlowAnimation = initAnimation
        ? leftGlowElement.animate(initFrameKeyframes, initAnimationOptions)
        : leftGlowElement.animate(frameKeyframes, animationOptions);
    }

    if (rightGlowElement) {
      rightGlowAnimation = initAnimation
        ? rightGlowElement.animate(initFrameKeyframes, initAnimationOptions)
        : rightGlowElement.animate(frameKeyframes, animationOptions);
    }

    if (!initAnimation) {
      syncAnimations(onLightsAnimation, updateDuration, [
        horizontalGlowAnimation,
        leftGlowAnimation,
        rightGlowAnimation,
      ]);
    }

    const cycleBetweenAnimations = async () => {
      if (onLightsAnimation && pixelGrid.length > pixelCountX * 2) {
        try {
          await onLightsAnimation.finished;
          setActiveAnimationIndex(initAnimation ? 1 : 0);
        } catch {}
      }
    };
    cycleBetweenAnimations();

    return () => {
      if (onLightsAnimation) {
        onLightsAnimation.cancel();
      }
      if (horizontalGlowAnimation) {
        horizontalGlowAnimation.cancel();
      }
      if (leftGlowAnimation) {
        leftGlowAnimation.cancel();
      }
      if (rightGlowAnimation) {
        rightGlowAnimation.cancel();
      }
    };
  }, [
    id,
    animationOptions,
    pixelKeyframes,
    frameKeyframes,
    updateDuration,
    updateAnimationId,
    staticMode,
    initPixelKeyframes,
    initFrameKeyframes,
    activeAnimationIndex,
    initAnimationOptions,
    pixelGrid.length,
    pixelCountX,
  ]);
};

export default useStaticSignAnimation;
