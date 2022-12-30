import { SignConfig } from "../types";
import { CANVAS_SCALING } from "../constants";
import { calcFrameSize } from "../utils";

type Tuple = [number, number];

export const getCanvasContext = (id: string) => {
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  const ctx = canvas ? canvas.getContext("2d") : null;

  return ctx;
};

export const drawFrame = (
  ctx: CanvasRenderingContext2D,
  config: SignConfig,
  animationFrame: number
) => {
  const { height, width, frameProportion } = config;
  const HEIGHT = height * CANVAS_SCALING;
  const WIDTH = width * CANVAS_SCALING;
  const SIZE = calcFrameSize(HEIGHT, frameProportion);

  const TRANSPARENT_COLOR = "hsl(0deg 0% 0% / 0)";
  const HORIZONTAL_SHADE_COLOR = "hsl(0deg 0% 100% / 0.15)";
  const VERTICAL_SHADE_COLOR = "hsl(0deg 0% 0% / 0.3)";
  const HORIZONTAL_SHADE_SIZE = 0.5;
  const VERTICAL_SHADE_SIZE = 0.5;

  const topLeftCorner: Tuple = [0, 0];
  const topRightCorner: Tuple = [WIDTH, 0];
  const bottomRightCorner: Tuple = [WIDTH, HEIGHT];
  const bottomLeftCorner: Tuple = [0, HEIGHT];

  const topLeftInner: Tuple = [SIZE, SIZE];
  const topRightInner: Tuple = [WIDTH - SIZE, SIZE];
  const bottomRightInner: Tuple = [WIDTH - SIZE, HEIGHT - SIZE];
  const bottomLeftInner: Tuple = [SIZE, HEIGHT - SIZE];

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const hGrd = ctx.createLinearGradient(0, 0, WIDTH, 0);
  hGrd.addColorStop(0, HORIZONTAL_SHADE_COLOR);
  hGrd.addColorStop(HORIZONTAL_SHADE_SIZE, TRANSPARENT_COLOR);
  hGrd.addColorStop(1 - HORIZONTAL_SHADE_SIZE, TRANSPARENT_COLOR);
  hGrd.addColorStop(1, HORIZONTAL_SHADE_COLOR);

  const vGrd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  vGrd.addColorStop(0, VERTICAL_SHADE_COLOR);
  vGrd.addColorStop(VERTICAL_SHADE_SIZE, TRANSPARENT_COLOR);
  vGrd.addColorStop(1 - VERTICAL_SHADE_SIZE, TRANSPARENT_COLOR);
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

export const drawMessage = (
  ctx: CanvasRenderingContext2D,
  config: SignConfig,
  animationFrame: number
) => {
  // TODO
};
