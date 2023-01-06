import {
  hslValuesToCss,
  calcFrameId,
  calcDisplayId,
  calcFrameSize,
  calcDisplayHeight,
  calcDisplayWidth,
  calcDisplayPaddingY,
  calcPixelSize,
  calcPixelCountX,
  calcDisplayPaddingX,
  calcPixelGrid,
  calcAnimationOffset,
  calcTotalOffset,
  calcMultiColorHue,
  isPixelOn,
  calcPixelXPos,
  calcPixelXCenterPos,
  calcPixelYPos,
  calcPixelYCenterPos,
} from "../utils";
import { ALPHABET, EMPTY_COLUMN } from "../constants/alphabet";

const TEST_CONFIG = {
  id: "123",
  text: "Test",
  height: 150,
  width: 800,
  colorHue: 180,
  animationFramesPerUpdate: 3,
  frameProportions: 0.2,
};

const pixelGridPadding = [];
for (let i = 0; i < 50; i++) {
  pixelGridPadding.push(EMPTY_COLUMN);
}

const TEST_COMPUTED_VALUES = {
  signHeight: TEST_CONFIG.height * 2,
  signWidth: TEST_CONFIG.width * 2,
  frameSize: 30,
  displayHeight: 240,
  displayWidth: 1540,
  displayPaddingX: 20,
  displayPaddingY: 15,
  pixelSize: 30,
  pixelCountX: 50,
  pixelCountY: 7,
  pixelGrid: [
    ...pixelGridPadding,
    ...ALPHABET.T,
    EMPTY_COLUMN,
    ...ALPHABET.E,
    EMPTY_COLUMN,
    ...ALPHABET.S,
    EMPTY_COLUMN,
    ...ALPHABET.T,
  ],
};

const TEST_X = 25;
const TEST_Y = 3;
const TEST_ANIMATION_FRAME = 100;
const TEST_ANIMATION_OFFSET = 33;
const TEST_OFFSET_X = 58;
const TEST_MULTI_COLOR_HUE = 161;
const TEST_PIXEL_X_POS = 770;
const TEST_PIXEL_X_CENTER_POS = 785;
const TEST_PIXEL_Y_POS = 105;
const TEST_PIXEL_Y_CENTER_POS = 120;

describe("Utils", () => {
  describe("hslValuesToCss", () => {
    test("Should use default values", () => {
      const style = hslValuesToCss(100);
      expect(style).toBe("hsl(100deg 100% 50%)");
    });

    test("Should return CSS style for provided values", () => {
      const style = hslValuesToCss(180, 50, 99);
      expect(style).toBe("hsl(180deg 50% 99%)");
    });

    test("Should set opacity if specified", () => {
      const style = hslValuesToCss(180, 50, 99, 0.5);
      expect(style).toBe("hsl(180deg 50% 99% / 0.5)");
    });
  });

  describe("calcFrameId", () => {
    test("Should return frame id", () => {
      const id = calcFrameId(TEST_CONFIG.id);
      expect(id).toBe("sign-frame-123");
    });
  });

  describe("calcDisplayId", () => {
    test("Should return display id", () => {
      const id = calcDisplayId(TEST_CONFIG.id);
      expect(id).toBe("sign-display-123");
    });
  });

  describe("calcFrameSize", () => {
    test("Should return frame size", () => {
      const size = calcFrameSize(
        TEST_COMPUTED_VALUES.signHeight,
        TEST_CONFIG.frameProportions
      );
      expect(size).toBe(TEST_COMPUTED_VALUES.frameSize);
    });
  });

  describe("calcDisplayHeight", () => {
    test("Should return display height", () => {
      const height = calcDisplayHeight(
        TEST_COMPUTED_VALUES.signHeight,
        TEST_COMPUTED_VALUES.frameSize
      );
      expect(height).toBe(TEST_COMPUTED_VALUES.displayHeight);
    });
  });

  describe("calcDisplayWidth", () => {
    test("Should return display width", () => {
      const width = calcDisplayWidth(
        TEST_COMPUTED_VALUES.signWidth,
        TEST_COMPUTED_VALUES.frameSize
      );
      expect(width).toBe(TEST_COMPUTED_VALUES.displayWidth);
    });
  });

  describe("calcDisplayPaddingY", () => {
    test("Should return display vertical padding", () => {
      const padding = calcDisplayPaddingY(TEST_COMPUTED_VALUES.signHeight);
      expect(padding).toBe(TEST_COMPUTED_VALUES.displayPaddingY);
    });
  });

  describe("calcPixelSize", () => {
    test("Should return pixel size", () => {
      const size = calcPixelSize(
        TEST_COMPUTED_VALUES.displayHeight,
        TEST_COMPUTED_VALUES.displayPaddingY
      );
      expect(size).toBe(TEST_COMPUTED_VALUES.pixelSize);
    });
  });

  describe("calcPixelCountX", () => {
    test("Should return horizontal pixel count", () => {
      const count = calcPixelCountX(
        TEST_COMPUTED_VALUES.displayWidth,
        TEST_COMPUTED_VALUES.displayPaddingY,
        TEST_COMPUTED_VALUES.pixelSize
      );
      expect(count).toBe(TEST_COMPUTED_VALUES.pixelCountX);
    });
  });

  describe("calcDisplayPaddingX", () => {
    test("Should return display horizontal padding", () => {
      const padding = calcDisplayPaddingX(
        TEST_COMPUTED_VALUES.displayWidth,
        TEST_COMPUTED_VALUES.pixelSize,
        TEST_COMPUTED_VALUES.pixelCountX
      );
      expect(padding).toBe(TEST_COMPUTED_VALUES.displayPaddingX);
    });
  });

  describe("calcPixelGrid", () => {
    test("Should return pixel grid", () => {
      const grid = calcPixelGrid(
        TEST_CONFIG.text,
        TEST_COMPUTED_VALUES.pixelCountX
      );
      expect(grid).toStrictEqual(TEST_COMPUTED_VALUES.pixelGrid);
    });
  });

  describe("calcAnimationOffset", () => {
    test("Should return animation offset", () => {
      const offset = calcAnimationOffset(
        TEST_ANIMATION_FRAME,
        TEST_CONFIG.animationFramesPerUpdate
      );
      expect(offset).toBe(TEST_ANIMATION_OFFSET);
    });
  });

  describe("calcTotalOffset", () => {
    test("Should return total offset", () => {
      const offset = calcTotalOffset(
        TEST_X,
        TEST_ANIMATION_OFFSET,
        TEST_COMPUTED_VALUES.pixelGrid
      );
      expect(offset).toBe(TEST_OFFSET_X);
    });
  });

  describe("calcMultiColorHue", () => {
    test("Should return multi color hue", () => {
      const color = calcMultiColorHue(
        TEST_OFFSET_X,
        TEST_Y,
        TEST_ANIMATION_FRAME,
        TEST_CONFIG.animationFramesPerUpdate
      );
      expect(color).toBe(TEST_MULTI_COLOR_HUE);
    });

    test("Should not go outside available hue values", () => {
      const color = calcMultiColorHue(
        TEST_OFFSET_X,
        TEST_Y,
        TEST_ANIMATION_FRAME + 360,
        TEST_CONFIG.animationFramesPerUpdate
      );
      expect(color).toBe(TEST_MULTI_COLOR_HUE);
    });

    test("Should change color every other frame if frames per update is 1", () => {
      const color = calcMultiColorHue(
        TEST_OFFSET_X,
        TEST_Y,
        TEST_ANIMATION_FRAME,
        1
      );
      expect(color).toBe(TEST_MULTI_COLOR_HUE - TEST_ANIMATION_FRAME / 2);
    });
  });

  describe("isPixelOn", () => {
    test("Should return if current pixel is on", () => {
      const isOn = isPixelOn(
        TEST_OFFSET_X,
        TEST_Y,
        TEST_COMPUTED_VALUES.pixelGrid
      );
      expect(isOn).toBe(true);
    });

    test("Should return false if pixel is outside grid", () => {
      const isOn1 = isPixelOn(-1, TEST_Y, TEST_COMPUTED_VALUES.pixelGrid);
      const isOn2 = isPixelOn(1000, TEST_Y, TEST_COMPUTED_VALUES.pixelGrid);

      expect(isOn1).toBe(false);
      expect(isOn2).toBe(false);
    });
  });

  describe("calcPixelXPos", () => {
    test("Should return pixel horizontal position", () => {
      const position = calcPixelXPos(
        TEST_X,
        TEST_COMPUTED_VALUES.pixelSize,
        TEST_COMPUTED_VALUES.displayPaddingX
      );
      expect(position).toBe(TEST_PIXEL_X_POS);
    });
  });

  describe("calcPixelXCenterPos", () => {
    test("Should return pixel horizontal center position", () => {
      const position = calcPixelXCenterPos(
        TEST_PIXEL_X_POS,
        TEST_COMPUTED_VALUES.pixelSize
      );
      expect(position).toBe(TEST_PIXEL_X_CENTER_POS);
    });
  });

  describe("calcPixelYPos", () => {
    test("Should return pixel vertical position", () => {
      const position = calcPixelYPos(
        TEST_Y,
        TEST_COMPUTED_VALUES.pixelSize,
        TEST_COMPUTED_VALUES.displayPaddingY
      );
      expect(position).toBe(TEST_PIXEL_Y_POS);
    });
  });

  describe("calcPixelYCenterPos", () => {
    test("Should return pixel vertical center position", () => {
      const position = calcPixelYCenterPos(
        TEST_PIXEL_Y_POS,
        TEST_COMPUTED_VALUES.pixelSize
      );
      expect(position).toBe(TEST_PIXEL_Y_CENTER_POS);
    });
  });
});

/* describe("", () => {
  test("", () => {
    const  = calcDisplayPaddingX();
    expect().toBe();
  });
}); */