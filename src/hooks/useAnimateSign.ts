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

  const animationOptions = useMemo(
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
  const calcKeyframes = useCallback(
    (itemSize: number) => [
      { transform: "translateX(0px)" },
      { transform: `translateX(-${itemSize * pixelGrid.length}px)` },
    ],
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
      const keyframes = calcKeyframes(pixelSize);

      onLightsAnimation = onLightsContainer.animate(
        keyframes,
        animationOptions
      );
    }

    if (frameGlowHorizontalAnimationContainer) {
      const keyframes = calcKeyframes(pixelSize);

      frameGlowHorizontalAnimation =
        frameGlowHorizontalAnimationContainer.animate(
          keyframes,
          animationOptions
        );
    }

    if (frameGlowVerticalLeftAnimationContainer) {
      const keyframes = calcKeyframes(frameSize);

      frameGlowVerticalLeftAnimation =
        frameGlowVerticalLeftAnimationContainer.animate(
          keyframes,
          animationOptions
        );
    }

    if (frameGlowVerticalRightAnimationContainer) {
      const keyframes = calcKeyframes(frameSize);

      frameGlowVerticalRightAnimation =
        frameGlowVerticalRightAnimationContainer.animate(
          keyframes,
          animationOptions
        );
    }

    const syncAnimations = async () => {
      if (onLightsAnimation) {
        try {
          await onLightsAnimation.ready;
          const { startTime } = onLightsAnimation;

          if (frameGlowHorizontalAnimation) {
            frameGlowHorizontalAnimation.startTime = startTime;
          }
          if (frameGlowVerticalLeftAnimation) {
            frameGlowVerticalLeftAnimation.startTime = startTime;
          }
          if (frameGlowVerticalRightAnimation) {
            frameGlowVerticalRightAnimation.startTime = startTime;
          }
        } catch {}
      }
    };
    syncAnimations();

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
    animationOptions,
    generateId,
    calcKeyframes,
    getContainer,
  ]);
};

export default useAnimateSign;
