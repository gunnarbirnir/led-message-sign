# LED Message Sign

HTML Canvas and Web Animations API experimentation.

UI to change props can be found here: [led-message-sign-ui](https://github.com/gunnarbirnir/led-message-sign-ui).

See here: [LED Message Sign](https://master--willowy-tarsier-1357d9.netlify.app/)

## Props

| Property                   | Type                 | Description                                                                                                                                                                            | Default | Constraints                    |
| -------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------ |
| `text`                     | `string \| string[]` | Message text.                                                                                                                                                                          |         | Max 100 characters.            |
| `height`                   | `number`             | Sign height.                                                                                                                                                                           | 150     | Min value is 60                |
| `width`                    | `number`             | Sign width.                                                                                                                                                                            | 800     | Min value is 100               |
| `fullWidth`                | `boolean`            | Make sign fill available space. If true, width prop will be ignored.                                                                                                                   | false   |                                |
| `colorHue`                 | `number`             | Hue value for HSL color.                                                                                                                                                               | 0       | Value is between 0 and 360     |
| `onBulbLightness`          | `number`             | Lightness value for HSL color of on bulbs.                                                                                                                                             | 95      | Value is between 70 and 100    |
| `offBulbLightness`         | `number`             | Lightness value for HSL color of off bulbs.                                                                                                                                            | 10      | Value is between 0 and 30      |
| `frameLightness`           | `number`             | Lightness value for HSL color of frame.                                                                                                                                                | 15      | Value is between 10 and 40     |
| `backgroundLightness`      | `number`             | Lightness value for HSL color of background.                                                                                                                                           | 0       | Value is between 0 and 30      |
| `hideFrame`                | `boolean`            | Hide sign frame.                                                                                                                                                                       | false   |                                |
| `coloredOffLights`         | `boolean`            | Should the off lights be colored.                                                                                                                                                      | true    |                                |
| `animationFramesPerUpdate` | `number`             | How many animation frames pass between sign updates.                                                                                                                                   | 6       | Value is between 1 and 60      |
| `staticMode`               | `boolean`            | In static mode, the text stays still. If the text overflows, it will eventually move to reveal the rest. Static mode does not work with a text array, so the first value will be used. | false   |                                |
| `staticModeDelay`          | `number`             | Delay in milliseconds before moving to reveal overflowing text.                                                                                                                        | 2000    | Value is between 100ms and 60s |
