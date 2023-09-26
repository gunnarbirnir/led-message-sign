import { useEffect, useMemo, useCallback } from "react";

import { generateId as generateIdUtil } from "../utils";
import { SignConfig, SignComputedValues } from "../types";
import {
  ON_LIGHTS_ANIMATION_CONTAINER_ID,
  FRAME_GLOW_HORIZONTAL_ANIMATION_CONTAINER_ID,
  FRAME_GLOW_VERTICAL_LEFT_ANIMATION_CONTAINER_ID,
  FRAME_GLOW_VERTICAL_RIGHT_ANIMATION_CONTAINER_ID,
} from "../constants/animation";

const SECOND_MS = 1000;

const useAnimateSign = (
  config: SignConfig,
  computedValues: SignComputedValues
) => {
  const { id, updatesPerSecond } = config;
  const { pixelSize, pixelGrid, frameSize } = computedValues;

  const animationBaseOptions = useMemo(
    () => ({
      duration: pixelGrid.length * (SECOND_MS / updatesPerSecond),
      easing: `steps(${pixelGrid.length})`,
      iterations: Infinity,
    }),
    [updatesPerSecond, pixelGrid.length]
  );

  const generateId = useCallback(
    (baseId: string) => generateIdUtil(id, baseId),
    [id]
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
    const frameGlowVerticalLeftAnimationContainer = getContainer(
      FRAME_GLOW_VERTICAL_LEFT_ANIMATION_CONTAINER_ID
    );
    const frameGlowVerticalRightAnimationContainer = getContainer(
      FRAME_GLOW_VERTICAL_RIGHT_ANIMATION_CONTAINER_ID
    );

    let onLightsAnimation: Animation | null = null;
    let frameGlowHorizontalAnimation: Animation | null = null;
    let frameGlowVerticalLeftAnimation: Animation | null = null;
    let frameGlowVerticalRightAnimation: Animation | null = null;

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
        id: generateId("frame-glow-horizontal-animation"),
        ...animationBaseOptions,
      };

      frameGlowHorizontalAnimation =
        frameGlowHorizontalAnimationContainer.animate(keyframes, options);
    }

    if (frameGlowVerticalLeftAnimationContainer) {
      const keyframes = {
        transform: [calcTransformDistance(frameSize)],
      };
      const options = {
        id: generateId("frame-glow-vertical-left-animation"),
        ...animationBaseOptions,
      };

      frameGlowVerticalLeftAnimation =
        frameGlowVerticalLeftAnimationContainer.animate(keyframes, options);
    }

    if (frameGlowVerticalRightAnimationContainer) {
      const keyframes = {
        transform: [calcTransformDistance(frameSize)],
      };
      const options = {
        id: generateId("frame-glow-vertical-right-animation"),
        ...animationBaseOptions,
      };

      frameGlowVerticalRightAnimation =
        frameGlowVerticalRightAnimationContainer.animate(keyframes, options);
    }

    if (onLightsAnimation?.effect) {
      const { progress } = onLightsAnimation.effect.getComputedTiming();

      if (progress !== null && progress !== undefined) {
        if (frameGlowHorizontalAnimation?.effect) {
          frameGlowHorizontalAnimation.effect.updateTiming({
            iterationStart: progress,
          });
        }

        if (frameGlowVerticalLeftAnimation?.effect) {
          frameGlowVerticalLeftAnimation.effect.updateTiming({
            iterationStart: progress,
          });
        }

        if (frameGlowVerticalRightAnimation?.effect) {
          frameGlowVerticalRightAnimation.effect.updateTiming({
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
      if (frameGlowVerticalLeftAnimation) {
        frameGlowVerticalLeftAnimation.cancel();
      }
      if (frameGlowVerticalRightAnimation) {
        frameGlowVerticalRightAnimation.cancel();
      }
    };
  }, [
    pixelSize,
    frameSize,
    animationBaseOptions,
    generateId,
    calcTransformDistance,
    getContainer,
  ]);
};

export default useAnimateSign;
