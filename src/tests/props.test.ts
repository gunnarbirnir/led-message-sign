import {
  sanitizeProps,
  sanitizeMinValue,
  sanitizeMinMaxValue,
} from "../utils/props";

const TEST_MESSAGE =
  "tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum varius duis at consectetur lorem donec massa sapien faucibus et molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt ornare massa eget egestas purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae auctor eu augue ut lectus arcu bibendum at varius vel pharetra vel turpis nunc eget lorem dolor sed viverra ipsum nunc aliquet tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum varius duis at consectetur bla";

describe("Props", () => {
  describe("sanitizeProps", () => {
    test("Should sanitize provided props", () => {
      const props = sanitizeProps({
        text: TEST_MESSAGE,
        height: 0,
        width: 0,
        colorHue: 1000,
        hideFrame: false,
        animationFramesPerUpdate: 0,
      });

      expect(props).toStrictEqual({
        text: TEST_MESSAGE.substring(0, 100),
        height: 50,
        width: 100,
        fullWidth: false,
        colorHue: 360,
        hideFrame: false,
        coloredOffLights: true,
        animationFramesPerUpdate: 1,
      });
    });
  });

  describe("sanitizeMinValue", () => {
    test("Should return value unchanged if it's bigger than min value", () => {
      const val = sanitizeMinValue(5, 3);
      expect(val).toBe(5);
    });

    test("Should return min value if supplied value is smaller", () => {
      const val = sanitizeMinValue(1, 3);
      expect(val).toBe(3);
    });
  });

  describe("sanitizeMinMaxValue", () => {
    test("Should return value unchanged if it's bigger than min value and smaller than max value", () => {
      const val = sanitizeMinMaxValue(5, 3, 7);
      expect(val).toBe(5);
    });

    test("Should return min value if supplied value is smaller", () => {
      const val = sanitizeMinMaxValue(1, 3, 7);
      expect(val).toBe(3);
    });

    test("Should return max value if supplied value is bigger", () => {
      const val = sanitizeMinMaxValue(9, 3, 7);
      expect(val).toBe(7);
    });
  });
});
