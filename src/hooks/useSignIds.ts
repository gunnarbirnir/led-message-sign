import { useMemo, useCallback } from "react";

import { generateId as generateIdUtil } from "../utils";
import useSignContext from "./useSignContext";
import {
  ON_LIGHTS_ANIMATION_CONTAINER_ID,
  FRAME_GLOW_HORIZONTAL_ANIMATION_CONTAINER_ID,
  FRAME_GLOW_VERTICAL_LEFT_ANIMATION_CONTAINER_ID,
  FRAME_GLOW_VERTICAL_RIGHT_ANIMATION_CONTAINER_ID,
} from "../constants/animation";

const useSignIds = () => {
  const {
    config: { id },
  } = useSignContext();

  const generateId = useCallback(
    (baseId: string) => generateIdUtil(id, baseId),
    [id]
  );

  const signIds = useMemo(
    () => ({
      displayOnLightsId: generateId("sign-display-on-lights"),
      displayOffLightsId: generateId("sign-display-off-lights"),
      onLightsAnimationContainerId: generateId(
        ON_LIGHTS_ANIMATION_CONTAINER_ID
      ),
      frameGlowHorizontalId: generateId("sign-frame-glow-horizontal"),
      frameGlowVerticalLeftId: generateId("sign-frame-glow-vertical-left"),
      frameGlowVerticalRightId: generateId("sign-frame-glow-vertical-right"),
      frameMaskingId: generateId("sign-frame-masking"),
      frameShadingId: generateId("sign-frame-shading"),
      frameGlowHorizontalAnimationContainerId: generateId(
        FRAME_GLOW_HORIZONTAL_ANIMATION_CONTAINER_ID
      ),
      frameGlowVerticalLeftAnimationContainerId: generateId(
        FRAME_GLOW_VERTICAL_LEFT_ANIMATION_CONTAINER_ID
      ),
      frameGlowVerticalRightAnimationContainerId: generateId(
        FRAME_GLOW_VERTICAL_RIGHT_ANIMATION_CONTAINER_ID
      ),
    }),
    [generateId]
  );

  return signIds;
};

export default useSignIds;
