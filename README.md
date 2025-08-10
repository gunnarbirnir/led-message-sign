# LED Message Sign

HTML Canvas and Web Animations API experimentation.

UI to change props can be found here: [led-message-sign-ui](https://github.com/gunnarbirnir/led-message-sign-ui).

See here: [LED Message Sign](https://master--willowy-tarsier-1357d9.netlify.app/)

### Props

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

## LED Image Sign

Works the same as the message sign but animates images instead of text.

UI to change props can be found here: [led-image-sign-ui](https://github.com/gunnarbirnir/led-image-sign-ui).

See here: [LED Image Sign](https://ephemeral-zuccutto-46fa11.netlify.app/)

### Props

| Property                      | Type                | Description                                                                             | Default | Constraints                 |
| ----------------------------- | ------------------- | --------------------------------------------------------------------------------------- | ------- | --------------------------- |
| `images`                      | `PixelGrid[]`       | Images to use in sign animation. All images will use the dimensions of the first image. |         |                             |
| `width`                       | `number`            | Sign width.                                                                             | 500     | Min value is 60             |
| `minHeight`                   | `number`            | Sign minimum height.                                                                    |         |                             |
| `fullWidth`                   | `boolean`           | Make sign fill available space. If true, width prop will be ignored.                    | false   |                             |
| `onBulbLightness`             | `number`            | Lightness value for HSL color of on bulbs.                                              | 95      | Value is between 70 and 100 |
| `offBulbLightness`            | `number`            | Lightness value for HSL color of off bulbs.                                             | 10      | Value is between 0 and 30   |
| `frameLightness`              | `number`            | Lightness value for HSL color of frame.                                                 | 15      | Value is between 10 and 40  |
| `backgroundLightness`         | `number`            | Lightness value for HSL color of background.                                            | 0       | Value is between 0 and 30   |
| `hideFrame`                   | `boolean`           | Hide sign frame.                                                                        | false   |                             |
| `animationFramesPerUpdate`    | `number`            | How many animation frames pass between sign updates.                                    | 6       | Value is between 1 and 60   |
| `animationOptions`            | `object`            | Options for animation behavior.                                                         |         |                             |
| `animationOptions.delay`      | `number`            | Delay in milliseconds before starting the animation.                                    |         |                             |
| `animationOptions.direction`  | `PlaybackDirection` | Direction of the animation playback.                                                    |         |                             |
| `animationOptions.fill`       | `FillMode`          | Determines how the animation applies styles to its target before and after execution.   |         |                             |
| `animationOptions.iterations` | `number`            | Number of times the animation should repeat.                                            |         |                             |
