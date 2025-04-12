import { PixelGrid } from "~/types";

const REDD = 0;

const GREN = 120;

const BLUE = 240;

export const TESTING_GBO: PixelGrid[] = [
  [
    [null, null, null, null, null, null, null, null, null, null],
    [null, null, REDD, GREN, GREN, GREN, GREN, REDD, null, null],
    [null, REDD, null, null, null, null, null, null, GREN, null],
    [null, BLUE, null, null, null, null, null, null, null, BLUE],
    [null, BLUE, null, null, null, BLUE, BLUE, BLUE, GREN, null],
    [null, REDD, null, null, null, null, null, null, GREN, null],
    [null, null, REDD, REDD, REDD, REDD, REDD, REDD, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ],
  [
    [null, null, null, null, null, null, null, null, null, null],
    [null, BLUE, REDD, GREN, GREN, GREN, GREN, REDD, null, null],
    [null, REDD, null, null, null, null, null, null, GREN, null],
    [null, BLUE, null, null, null, null, null, GREN, null, null],
    [null, BLUE, GREN, GREN, GREN, BLUE, BLUE, BLUE, GREN, null],
    [null, REDD, null, null, null, null, null, null, GREN, null],
    [null, REDD, REDD, REDD, REDD, REDD, REDD, REDD, null, null],
    [REDD, null, null, null, null, null, null, null, null, null],
  ],
  [
    [null, null, null, null, BLUE, BLUE, REDD, null, null, null],
    [null, null, REDD, GREN, GREN, GREN, GREN, REDD, null, null],
    [null, REDD, null, null, null, null, null, null, GREN, null],
    [null, BLUE, null, null, null, null, null, null, REDD, null],
    [null, BLUE, null, null, null, null, null, null, GREN, null],
    [null, REDD, null, null, null, null, null, null, GREN, null],
    [null, null, REDD, REDD, REDD, REDD, REDD, REDD, null, null],
    [null, null, null, null, null, null, null, null, null, null],
  ],
];

export const TESTING_PARTY: PixelGrid[] = [
  [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, GREN, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
  ],
  [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, GREN, GREN, GREN, null, null, null],
    [null, null, null, GREN, null, GREN, null, null, null],
    [null, null, null, GREN, GREN, GREN, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
  ],
  [
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, GREN, GREN, GREN, GREN, GREN, null, null],
    [null, null, GREN, null, null, null, GREN, null, null],
    [null, null, GREN, null, null, null, GREN, null, null],
    [null, null, GREN, null, null, null, GREN, null, null],
    [null, null, GREN, GREN, GREN, GREN, GREN, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
  ],
  [
    [null, null, null, null, null, null, null, null, null],
    [null, GREN, GREN, GREN, GREN, GREN, GREN, GREN, null],
    [null, GREN, null, null, null, null, null, GREN, null],
    [null, GREN, null, null, null, null, null, GREN, null],
    [null, GREN, null, null, null, null, null, GREN, null],
    [null, GREN, null, null, null, null, null, GREN, null],
    [null, GREN, null, null, null, null, null, GREN, null],
    [null, GREN, GREN, GREN, GREN, GREN, GREN, GREN, null],
    [null, null, null, null, null, null, null, null, null],
  ],
  [
    [GREN, GREN, GREN, GREN, GREN, GREN, GREN, GREN, GREN],
    [GREN, null, null, null, null, null, null, null, GREN],
    [GREN, null, null, null, null, null, null, null, GREN],
    [GREN, null, null, null, null, null, null, null, GREN],
    [GREN, null, null, null, null, null, null, null, GREN],
    [GREN, null, null, null, null, null, null, null, GREN],
    [GREN, null, null, null, null, null, null, null, GREN],
    [GREN, null, null, null, null, null, null, null, GREN],
    [GREN, GREN, GREN, GREN, GREN, GREN, GREN, GREN, GREN],
  ],
];
