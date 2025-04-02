import { SignImage } from "../types";

const REDD = 0;

const GREN = 120;

const BLUE = 240;

export const TESTING_G: SignImage[] = [
  {
    pixelGrid: [
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, REDD, GREN, GREN, GREN, GREN, REDD, null, null],
      [null, REDD, null, null, null, null, null, null, GREN, null],
      [null, BLUE, null, null, null, null, null, null, null, BLUE],
      [null, BLUE, null, null, null, BLUE, BLUE, BLUE, GREN, null],
      [null, REDD, null, null, null, null, null, null, GREN, null],
      [null, null, REDD, REDD, REDD, REDD, REDD, REDD, null, null],
      [null, null, null, null, null, null, null, null, null, null],
    ],
  },
];
