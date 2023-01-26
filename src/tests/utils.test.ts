import {
  hslValuesToCss,
  calcFrameIds,
  calcDisplayIds,
  calcFrameSize,
  calcDisplayHeight,
  calcDisplayWidth,
  calcDisplayPaddingY,
  calcPixelAreaHeight,
  calcPixelSize,
  calcPixelCountX,
  calcPixelAreaWidth,
  calcDisplayPaddingX,
  calcPixelGrid,
  calcAnimationOffset,
  isWholeNumber,
  calcTotalOffset,
  isPixelOn,
  calcPixelXPos,
  calcPixelXCenterPos,
  calcPixelYPos,
  calcPixelYCenterPos,
  calcImageOffset,
  calcGlowPosition,
  calcDisableGlow,
  calcPixelGlow,
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

const pixelGridPadding: number[][] = [];
for (let i = 0; i < 50; i++) {
  pixelGridPadding.push(EMPTY_COLUMN);
}

const TEST_COMPUTED_VALUES = {
  signHeight: TEST_CONFIG.height * 2,
  signWidth: TEST_CONFIG.width * 2,
  frameSize: 30,
  displayHeight: 240,
  displayWidth: 1540,
  pixelAreaHeight: 210,
  pixelAreaWidth: 1500,
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
const TEST_ANIMATION_FRAME = 99;
const TEST_ANIMATION_OFFSET = 33;
const TEST_OFFSET_X = 58;
const TEST_PIXEL_X_POS = 770;
const TEST_PIXEL_X_CENTER_POS = 785;
const TEST_PIXEL_Y_POS = 105;
const TEST_PIXEL_Y_CENTER_POS = 120;
const TEST_IMAGE_OFFSET = 990;

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
    test("Should return frame ids", () => {
      const id = calcFrameIds(TEST_CONFIG.id);
      expect(id).toStrictEqual({
        frameGlowId: "sign-frame-glow-123",
        frameMaskingId: "sign-frame-masking-123",
        frameShadingId: "sign-frame-shading-123",
      });
    });
  });

  describe("calcDisplayId", () => {
    test("Should return display ids", () => {
      const id = calcDisplayIds(TEST_CONFIG.id);
      expect(id).toStrictEqual({
        displayOnLightsId: "sign-display-on-lights-123",
        displayOffLightsId: "sign-display-off-lights-123",
      });
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

  describe("calcPixelAreaHeight", () => {
    test("Should return pixel area height", () => {
      const height = calcPixelAreaHeight(
        TEST_COMPUTED_VALUES.displayHeight,
        TEST_COMPUTED_VALUES.displayPaddingY
      );
      expect(height).toBe(TEST_COMPUTED_VALUES.pixelAreaHeight);
    });
  });

  describe("calcPixelSize", () => {
    test("Should return pixel size", () => {
      const size = calcPixelSize(TEST_COMPUTED_VALUES.pixelAreaHeight);
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

  describe("calcPixelAreaWidth", () => {
    test("Should return pixel area width", () => {
      const width = calcPixelAreaWidth(
        TEST_COMPUTED_VALUES.pixelSize,
        TEST_COMPUTED_VALUES.pixelCountX
      );
      expect(width).toBe(TEST_COMPUTED_VALUES.pixelAreaWidth);
    });
  });

  describe("calcDisplayPaddingX", () => {
    test("Should return display horizontal padding", () => {
      const padding = calcDisplayPaddingX(
        TEST_COMPUTED_VALUES.displayWidth,
        TEST_COMPUTED_VALUES.pixelAreaWidth
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

  describe("isWholeNumber", () => {
    test("Should return true for whole number", () => {
      const isWhole = isWholeNumber(5);
      expect(isWhole).toBe(true);
    });

    test("Should return false for decimal number", () => {
      const isWhole = isWholeNumber(5.5);
      expect(isWhole).toBe(false);
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

  describe("calcImageOffset", () => {
    test("Should return image offset", () => {
      const offset = calcImageOffset(
        TEST_COMPUTED_VALUES.pixelSize,
        TEST_COMPUTED_VALUES.pixelGrid,
        TEST_ANIMATION_OFFSET
      );
      expect(offset).toBe(TEST_IMAGE_OFFSET);
    });

    test("Should return same image offset after one lap", () => {
      const offset = calcImageOffset(
        TEST_COMPUTED_VALUES.pixelSize,
        TEST_COMPUTED_VALUES.pixelGrid,
        TEST_ANIMATION_OFFSET + TEST_COMPUTED_VALUES.pixelGrid.length
      );
      expect(offset).toBe(TEST_IMAGE_OFFSET);
    });
  });

  describe("calcGlowPosition", () => {
    test("Should return horizontal glow position", () => {
      const position = calcGlowPosition(
        TEST_X,
        TEST_COMPUTED_VALUES.signWidth,
        TEST_COMPUTED_VALUES.pixelSize,
        TEST_COMPUTED_VALUES.pixelCountX
      );
      // Has a lot of decimals
      const rounded = Math.round(position * 10) / 10;

      expect(rounded).toBe(0.5);
    });

    test("Should return vertical glow position", () => {
      const position = calcGlowPosition(
        TEST_Y,
        TEST_COMPUTED_VALUES.signHeight,
        TEST_COMPUTED_VALUES.pixelSize,
        TEST_COMPUTED_VALUES.pixelCountY
      );
      const rounded = Math.round(position * 10) / 10;

      expect(rounded).toBe(0.5);
    });
  });

  describe("calcDisableGlow", () => {
    test("Should return 0 for starting position", () => {
      const disableGlow = calcDisableGlow(
        TEST_X,
        TEST_X,
        TEST_COMPUTED_VALUES.pixelCountX
      );
      expect(disableGlow).toBe(0);
    });

    test("Should return 0 for position before start", () => {
      const disableGlow = calcDisableGlow(49, 48, 50);
      expect(disableGlow).toBe(0);
    });

    test("Should return 0 for position after start", () => {
      const disableGlow = calcDisableGlow(0, 1, 50);
      expect(disableGlow).toBe(0);
    });

    test("Should return undefined for other position", () => {
      const disableGlow = calcDisableGlow(
        TEST_X,
        TEST_OFFSET_X,
        TEST_COMPUTED_VALUES.pixelCountX
      );
      expect(disableGlow).toBe(undefined);
    });
  });

  describe("calcPixelGlow", () => {
    test("Should return 1 since pixel is on", () => {
      const glow = calcPixelGlow(
        TEST_OFFSET_X,
        TEST_Y,
        TEST_COMPUTED_VALUES.pixelGrid
      );
      expect(glow).toBe(1);
    });

    test("Should return 0.75 for pixel at distance 1", () => {
      const glow = calcPixelGlow(
        TEST_OFFSET_X + 2,
        TEST_Y,
        TEST_COMPUTED_VALUES.pixelGrid
      );
      expect(glow).toBe(0.75);
    });

    test("Should return 0.5 for pixel at distance 2", () => {
      const glow = calcPixelGlow(
        TEST_OFFSET_X + 3,
        TEST_Y,
        TEST_COMPUTED_VALUES.pixelGrid
      );
      expect(glow).toBe(0.5);
    });

    test("Should return 0 for pixel with longer distance", () => {
      const glow = calcPixelGlow(
        TEST_X,
        TEST_Y,
        TEST_COMPUTED_VALUES.pixelGrid
      );
      expect(glow).toBe(0);
    });
  });
});
