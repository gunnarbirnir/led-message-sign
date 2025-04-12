import { useCallback, useEffect, useMemo } from "react";

import { FRAME_DURATION } from "~/constants";
import { type SignComputedValues } from "~/types";
import { getSignIds, syncAnimations } from "~/utils";

import { type ImageSignConfig } from "../types";

const useSignAnimation = (
  config: ImageSignConfig,
  computedValues: SignComputedValues
) => {
  const {
    id,
    animationFramesPerUpdate,
    images,
    animationOptions: { delay, direction, fill, iterations = Infinity },
  } = config;
  const { pixelSize, pixelGrid, frameSize } = computedValues;

  const updateDuration = useMemo(
    () => FRAME_DURATION * animationFramesPerUpdate,
    [animationFramesPerUpdate]
  );

  const animationOptions = useMemo(
    () => ({
      delay,
      direction,
      fill,
      iterations,
      duration: images.length * updateDuration,
      easing: `steps(${images.length})`,
    }),
    [images.length, updateDuration, delay, direction, fill, iterations]
  );

  const calcKeyframes = useCallback(
    (itemSize: number) => [
      { transform: "translateX(0px)" },
      { transform: `translateX(-${itemSize * pixelGrid.length}px)` },
    ],
    [pixelGrid.length]
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
      onLightsAnimation = onLightsElement.animate(
        pixelKeyframes,
        animationOptions
      );
    }
    if (horizontalGlowElement) {
      horizontalGlowAnimation = horizontalGlowElement.animate(
        pixelKeyframes,
        animationOptions
      );
    }
    if (leftGlowElement) {
      leftGlowAnimation = leftGlowElement.animate(
        frameKeyframes,
        animationOptions
      );
    }
    if (rightGlowElement) {
      rightGlowAnimation = rightGlowElement.animate(
        frameKeyframes,
        animationOptions
      );
    }

    syncAnimations(
      [
        onLightsAnimation,
        horizontalGlowAnimation,
        leftGlowAnimation,
        rightGlowAnimation,
      ],
      updateDuration
    );

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
  }, [id, updateDuration, animationOptions, pixelKeyframes, frameKeyframes]);
};

export default useSignAnimation;
