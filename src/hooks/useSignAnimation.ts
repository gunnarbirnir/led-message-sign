import { useEffect, useMemo, useCallback } from "react";

import { SignConfig, SignComputedValues } from "../types";
import { getSignIds } from "../utils";

// 60 frames per second
const FRAME_DURATION = 1000 / 60;

const useSignAnimation = (
  { id, animationFramesPerUpdate }: SignConfig,
  { pixelSize, pixelGrid, frameSize }: SignComputedValues
) => {
  const updateDuration = useMemo(
    () => FRAME_DURATION * animationFramesPerUpdate,
    [animationFramesPerUpdate]
  );
  const animationOptions = useMemo(
    () => ({
      duration: pixelGrid.length * updateDuration,
      easing: `steps(${pixelGrid.length})`,
      iterations: Infinity,
    }),
    [pixelGrid.length, updateDuration]
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

    const syncAnimations = async () => {
      if (onLightsAnimation) {
        try {
          await onLightsAnimation.ready;
          const { startTime } = onLightsAnimation;
          // Sync to animation frame
          const roundedStartTime =
            startTime !== null
              ? Math.ceil((startTime as number) / updateDuration) *
                updateDuration
              : null;

          onLightsAnimation.startTime = roundedStartTime;
          if (horizontalGlowAnimation) {
            horizontalGlowAnimation.startTime = roundedStartTime;
          }
          if (leftGlowAnimation) {
            leftGlowAnimation.startTime = roundedStartTime;
          }
          if (rightGlowAnimation) {
            rightGlowAnimation.startTime = roundedStartTime;
          }
        } catch {}
      }
    };
    syncAnimations();

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
  }, [id, animationOptions, pixelKeyframes, frameKeyframes, updateDuration]);
};

export default useSignAnimation;
