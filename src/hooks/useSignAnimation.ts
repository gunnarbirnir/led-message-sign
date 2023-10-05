import { useEffect, useMemo, useCallback } from "react";

import { SignConfig, SignComputedValues } from "../types";
import { getSignIds } from "../utils";

// 60 frames per second
const FRAME_DURATION = 1000 / 60;

const useSignAnimation = (
  { id, animationFramesPerUpdate }: SignConfig,
  { pixelSize, pixelGrid, frameSize }: SignComputedValues
) => {
  const animationOptions = useMemo(
    () => ({
      duration: pixelGrid.length * FRAME_DURATION * animationFramesPerUpdate,
      easing: `steps(${pixelGrid.length})`,
      iterations: Infinity,
    }),
    [animationFramesPerUpdate, pixelGrid.length]
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

          if (horizontalGlowAnimation) {
            horizontalGlowAnimation.startTime = startTime;
          }
          if (leftGlowAnimation) {
            leftGlowAnimation.startTime = startTime;
          }
          if (rightGlowAnimation) {
            rightGlowAnimation.startTime = startTime;
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
  }, [id, animationOptions, pixelKeyframes, frameKeyframes]);
};

export default useSignAnimation;
