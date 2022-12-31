import { COLORS, COLOR_VALUES } from "../constants/colors";
import { hslValuesToCss } from "../utils";

type Tuple = [number, number];

interface SignComputedValues {
  signHeight: number;
  signWidth: number;
  frameSize: number;
  displayHeight: number;
  displayWidth: number;
  displayPaddingX: number;
  displayPaddingY: number;
  pixelAreaHeight: number;
  pixelAreaWidth: number;
  pixelSize: number;
  pixelCountX: number;
  pixelCountY: number;
}

export const getCanvasContext = (id: string) => {
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  const ctx = canvas ? canvas.getContext("2d") : null;

  return ctx;
};

const FRAME_COLOR = COLORS.FRAME;
const HORIZONTAL_SHADE_COLOR = hslValuesToCss(
  COLOR_VALUES.FRAME.hue,
  COLOR_VALUES.FRAME.saturation,
  COLOR_VALUES.FRAME.lightness + 10
);
const VERTICAL_SHADE_COLOR = hslValuesToCss(
  COLOR_VALUES.FRAME.hue,
  COLOR_VALUES.FRAME.saturation,
  COLOR_VALUES.FRAME.lightness - 10
);
const HORIZONTAL_SHADE_SIZE = 0.3;
const VERTICAL_SHADE_SIZE = 0.4;

export const drawFrame = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  animationFrame: number
) => {
  const { signHeight, signWidth, frameSize } = computedValues;

  const topLeftCorner: Tuple = [0, 0];
  const topRightCorner: Tuple = [signWidth, 0];
  const bottomRightCorner: Tuple = [signWidth, signHeight];
  const bottomLeftCorner: Tuple = [0, signHeight];

  const topLeftInner: Tuple = [frameSize, frameSize];
  const topRightInner: Tuple = [signWidth - frameSize, frameSize];
  const bottomRightInner: Tuple = [
    signWidth - frameSize,
    signHeight - frameSize,
  ];
  const bottomLeftInner: Tuple = [frameSize, signHeight - frameSize];

  ctx.clearRect(0, 0, signWidth, signHeight);

  const hGrd = ctx.createLinearGradient(0, 0, signWidth, 0);
  hGrd.addColorStop(0, HORIZONTAL_SHADE_COLOR);
  hGrd.addColorStop(HORIZONTAL_SHADE_SIZE, FRAME_COLOR);
  hGrd.addColorStop(1 - HORIZONTAL_SHADE_SIZE, FRAME_COLOR);
  hGrd.addColorStop(1, HORIZONTAL_SHADE_COLOR);

  const vGrd = ctx.createLinearGradient(0, 0, 0, signHeight);
  vGrd.addColorStop(0, VERTICAL_SHADE_COLOR);
  vGrd.addColorStop(VERTICAL_SHADE_SIZE, FRAME_COLOR);
  vGrd.addColorStop(1 - VERTICAL_SHADE_SIZE, FRAME_COLOR);
  vGrd.addColorStop(1, VERTICAL_SHADE_COLOR);

  // Top border
  ctx.moveTo(...topLeftCorner);
  ctx.beginPath();
  ctx.lineTo(...topLeftInner);
  ctx.lineTo(...topRightInner);
  ctx.lineTo(...topRightCorner);
  ctx.lineTo(...topLeftCorner);
  ctx.fillStyle = hGrd;
  ctx.fill();

  // Right border
  ctx.moveTo(...topRightCorner);
  ctx.beginPath();
  ctx.lineTo(...topRightInner);
  ctx.lineTo(...bottomRightInner);
  ctx.lineTo(...bottomRightCorner);
  ctx.lineTo(...topRightCorner);
  ctx.fillStyle = vGrd;
  ctx.fill();

  // Bottom border
  ctx.moveTo(...bottomRightCorner);
  ctx.beginPath();
  ctx.lineTo(...bottomRightInner);
  ctx.lineTo(...bottomLeftInner);
  ctx.lineTo(...bottomLeftCorner);
  ctx.lineTo(...bottomRightCorner);
  ctx.fillStyle = hGrd;
  ctx.fill();

  // Left border
  ctx.moveTo(...bottomLeftCorner);
  ctx.beginPath();
  ctx.lineTo(...bottomLeftInner);
  ctx.lineTo(...topLeftInner);
  ctx.lineTo(...topLeftCorner);
  ctx.lineTo(...bottomLeftCorner);
  ctx.fillStyle = vGrd;
  ctx.fill();

  // TODO: Add glow from letters
};

export const drawDisplay = (
  ctx: CanvasRenderingContext2D,
  computedValues: SignComputedValues,
  animationFrame: number
) => {
  const {
    displayHeight,
    displayWidth,
    displayPaddingX,
    displayPaddingY,
    pixelAreaHeight,
    pixelAreaWidth,
  } = computedValues;

  ctx.fillStyle = hslValuesToCss(animationFrame % 360, 100, 50);
  ctx.fillRect(0, 0, displayWidth, displayHeight);
  ctx.fillStyle = hslValuesToCss(animationFrame % 360, 100, 20);
  ctx.fillRect(
    displayPaddingX,
    displayPaddingY,
    pixelAreaWidth,
    pixelAreaHeight
  );
};
