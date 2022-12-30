import { SignConfig } from "../types";

export const getCanvasContext = (id: string) => {
  const canvas = document.getElementById(id) as HTMLCanvasElement;
  const ctx = canvas ? canvas.getContext("2d") : null;

  return ctx;
};

export const drawFrame = (
  ctx: CanvasRenderingContext2D | null,
  config: SignConfig,
  animationFrame: number
) => {
  // TODO
};

export const drawMessage = (
  ctx: CanvasRenderingContext2D | null,
  config: SignConfig,
  animationFrame: number
) => {
  // TODO
};
