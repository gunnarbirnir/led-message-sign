import { useCallback, useEffect, useMemo, useState } from "react";

import { FRAME_DURATION } from "~/constants";
import { getSignIds, syncAnimations } from "~/utils";
import { SignComputedValues } from "~/types";

import { MessageSignConfig } from "../types";

const useStaticSignAnimation = (
  {
    id,
    animationFramesPerUpdate,
    staticMode,
    staticModeDelay,
  }: MessageSignConfig,
  { pixelSize, pixelGrid, frameSize, pixelCountX }: SignComputedValues,
  {
    updateAnimationId,
  }: { onAnimationFinished?: () => void; updateAnimationId?: string }
) => {
  const [animationTimestamp, setAnimationTimestamp] = useState(Date.now());
  const updateDuration = useMemo(
    () => FRAME_DURATION * animationFramesPerUpdate,
    [animationFramesPerUpdate]
  );
  const animationOptions = useMemo(
    () => ({
      duration: pixelGrid.length * updateDuration,
      easing: `steps(${pixelGrid.length})`,
      iterations: 1,
      delay: staticModeDelay,
      fill: "both" as FillMode,
    }),
    [pixelGrid.length, updateDuration, staticModeDelay]
  );

  const calcKeyframes = useCallback(
    (itemSize: number) => {
      const initTranslateDistance = itemSize * pixelCountX;
      const overflowTranslateDistance = itemSize * pixelGrid.length;
      const overflowTranslateOffset =
        (pixelGrid.length - pixelCountX) / pixelGrid.length;

      return [
        { transform: `translateX(-${initTranslateDistance}px)` },
        {
          transform: `translateX(-${overflowTranslateDistance}px)`,
          offset: overflowTranslateOffset,
        },
        {
          transform: `translateX(0px)`,
          offset: overflowTranslateOffset,
        },
        { transform: `translateX(-${initTranslateDistance}px)` },
      ];
    },
    [pixelCountX, pixelGrid.length]
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
    const textOverflows = pixelGrid.length > pixelCountX * 2;
    if (!staticMode || !textOverflows) {
      return;
    }

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

    const restartAnimation = async () => {
      if (onLightsAnimation) {
        try {
          await onLightsAnimation.finished;
          setAnimationTimestamp(Date.now());
        } catch {}
      }
    };
    restartAnimation();

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
    animationTimestamp,
    updateDuration,
    animationOptions,
    pixelKeyframes,
    frameKeyframes,
    updateAnimationId,
    staticMode,
    pixelGrid.length,
    pixelCountX,
  ]);
};

export default useStaticSignAnimation;
