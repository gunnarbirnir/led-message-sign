import { SignImage } from "../types";

const REDD = 0;

/* const COLOR_GREEN: HSLColorValues = {
  hue: 100,
  saturation: 100,
  lightness: 50,
};

const COLOR_BLUE: HSLColorValues = {
  hue: 200,
  saturation: 100,
  lightness: 50,
}; */

export const TESTING_G: SignImage[] = [
  {
    pixelGrid: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, REDD, REDD, REDD, REDD, REDD, REDD, null, null],
      [null, REDD, null, null, null, null, null, null, REDD, null],
      [null, REDD, null, null, null, null, null, null, null, null],
      [null, REDD, null, null, null, REDD, REDD, REDD, REDD, null],
      [null, REDD, null, null, null, null, null, null, REDD, null],
      [null, null, REDD, REDD, REDD, REDD, REDD, REDD, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ],
  },
];
