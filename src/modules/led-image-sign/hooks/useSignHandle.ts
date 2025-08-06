import { type ForwardedRef, useImperativeHandle } from "react";

import { FRAME_OFFSET_PADDING } from "~/constants";
import { type SignColors, type SignComputedValues } from "~/types";
import { getCanvasChunks, getCanvasContext, getSignIds } from "~/utils";
import { drawDisplayOffLights, drawDisplayOnLights } from "~/utils/display";
import { drawFrameHorizontalGlow, drawFrameVerticalGlow } from "~/utils/frame";

import { type ImageSignRef } from "../types";
import { flipAxis } from "../utils";

export const useSignHandle = (
  ref: ForwardedRef<ImageSignRef>,
  {
    id,
    computedValues,
    colors,
  }: {
    id: string;
    computedValues: SignComputedValues;
    colors: SignColors;
  }
) => {
  useImperativeHandle(
    ref,
    () => ({
      redrawImage: ({ newImage }: { newImage: (number | null)[][] }) => {
        const { pixelSize, pixelGrid, pixelCountX, signHeight, frameSize } =
          computedValues;
        const {
          displayOnLightsId,
          displayOffLightsId,
          frameHorizontalGlowId,
          frameLeftGlowId,
          frameRightGlowId,
        } = getSignIds(id);

        const onLightsCanvasChunks = getCanvasChunks(
          displayOnLightsId,
          pixelSize,
          pixelGrid.length,
          pixelCountX
        );
        const displayOffLightsCtx = getCanvasContext(displayOffLightsId);
        const horizontalGlowCanvasChunks = getCanvasChunks(
          frameHorizontalGlowId,
          pixelSize,
          pixelGrid.length,
          pixelCountX
        );
        const leftGlowCanvasChunks = getCanvasChunks(
          frameLeftGlowId,
          frameSize,
          pixelGrid.length,
          pixelCountX
        );
        const rightGlowCanvasChunks = getCanvasChunks(
          frameRightGlowId,
          frameSize,
          pixelGrid.length,
          pixelCountX
        );

        const horizontalGlowHeight = signHeight - 2 * FRAME_OFFSET_PADDING;
        const updatedComputedValues = { ...computedValues };
        updatedComputedValues.pixelGrid = flipAxis(newImage);

        if (displayOffLightsCtx) {
          drawDisplayOffLights(
            displayOffLightsCtx,
            updatedComputedValues,
            colors
          );
        }
        drawDisplayOnLights(
          onLightsCanvasChunks,
          updatedComputedValues,
          colors
        );
        drawFrameHorizontalGlow(
          horizontalGlowCanvasChunks,
          { ...updatedComputedValues, signHeight: horizontalGlowHeight },
          colors,
          true
        );
        drawFrameVerticalGlow(
          leftGlowCanvasChunks,
          updatedComputedValues,
          colors
        );
        drawFrameVerticalGlow(
          rightGlowCanvasChunks,
          updatedComputedValues,
          colors,
          "right"
        );
      },
    }),
    [colors, computedValues, id]
  );
};
