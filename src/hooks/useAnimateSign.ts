import { useEffect, useMemo, useCallback } from "react";

import { SignConfig, SignComputedValues } from "../types";
import {
  ON_LIGHTS_ANIMATION_CONTAINER_ID,
  FRAME_GLOW_HORIZONTAL_ANIMATION_CONTAINER_ID,
} from "../constants/animation";

const useAnimateSign = (
  config: SignConfig,
  computedValues: SignComputedValues,
  generateId: (baseId: string) => string
) => {
  const { durationPerPosition } = config;
  const { pixelSize, pixelGrid } = computedValues;

  const animationBaseOptions = useMemo(
    () => ({
      duration: pixelGrid.length * durationPerPosition,
      easing: `steps(${pixelGrid.length})`,
      iterations: Infinity,
    }),
    [durationPerPosition, pixelGrid.length]
  );

  const calcTransformDistance = useCallback(
    (itemSize: number) => `translateX(-${itemSize * pixelGrid.length}px)`,
    [pixelGrid.length]
  );
  // Use refs instead?
  const getContainer = useCallback(
    (baseId: string) => document.getElementById(generateId(baseId)),
    [generateId]
  );

  useEffect(() => {
    const onLightsContainer = getContainer(ON_LIGHTS_ANIMATION_CONTAINER_ID);
    const frameGlowHorizontalAnimationContainer = getContainer(
      FRAME_GLOW_HORIZONTAL_ANIMATION_CONTAINER_ID
    );

    let onLightsAnimation: Animation | null = null;
    let frameGlowHorizontalAnimation: Animation | null = null;

    if (onLightsContainer) {
      const keyframes = {
        transform: [calcTransformDistance(pixelSize)],
      };
      const options = {
        id: generateId("on-lights-animation"),
        ...animationBaseOptions,
      };

      onLightsAnimation = onLightsContainer.animate(keyframes, options);
    }

    if (frameGlowHorizontalAnimationContainer) {
      const keyframes = {
        transform: [calcTransformDistance(pixelSize)],
      };
      const options = {
        id: generateId("frame-glow-animation"),
        ...animationBaseOptions,
      };

      frameGlowHorizontalAnimation =
        frameGlowHorizontalAnimationContainer.animate(keyframes, options);
    }

    if (onLightsAnimation?.effect) {
      const { progress } = onLightsAnimation.effect.getComputedTiming();

      if (progress !== null && progress !== undefined) {
        if (frameGlowHorizontalAnimation?.effect) {
          frameGlowHorizontalAnimation.effect.updateTiming({
            iterationStart: progress,
          });
        }
      }
    }

    return () => {
      if (onLightsAnimation) {
        onLightsAnimation.cancel();
      }
      if (frameGlowHorizontalAnimation) {
        frameGlowHorizontalAnimation.cancel();
      }
    };
  }, [
    pixelSize,
    animationBaseOptions,
    generateId,
    calcTransformDistance,
    getContainer,
  ]);
};

export default useAnimateSign;
