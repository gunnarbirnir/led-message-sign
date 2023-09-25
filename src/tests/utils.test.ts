import {
  hslValuesToCss,
  calcComputedValues,
  calcPixelGrid,
  isPixelOn,
} from "../utils";
import { ALPHABET, EMPTY_COLUMN } from "../constants/alphabet";

const TEST_CONFIG = {
  id: "123",
  text: "Test",
  height: 150,
  width: 800,
  colorHue: 180,
  durationPerPosition: 150,
  frameProportion: 0.2,
  fullWidth: false,
  hideFrame: false,
  coloredOffLights: true,
};

const pixelGridPadding: number[][] = [];
for (let i = 0; i < 50; i++) {
  pixelGridPadding.push(EMPTY_COLUMN);
}

const TEST_COMPUTED_VALUES = {
  signHeight: 300,
  signWidth: 1600,
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
  imageWidth: 2190,
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

const TEST_Y = 3;
const TEST_OFFSET_X = 58;

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

  describe("calcComputedValues", () => {
    test("Should return computed values", () => {
      const computed = calcComputedValues(TEST_CONFIG);
      expect(computed).toEqual(TEST_COMPUTED_VALUES);
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
});
