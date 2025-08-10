export const CANVAS_SCALING = window.devicePixelRatio ?? 2;
// 60 frames per second
export const FRAME_DURATION = 1000 / 60;
export const CANVAS_CHUNK_SIZE = 4000 / CANVAS_SCALING;
// To prevent overflow
export const FRAME_OFFSET_PADDING = 1;
