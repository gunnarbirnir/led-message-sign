import { FC } from "react";

import LEDMessageSign from "./components/LEDMessageSign";

const App: FC = () => {
  return (
    <LEDMessageSign
      text="LED Message Sign"
      // height={100}
      // width={500}
      // fullWidth
      // hueDegrees={110}
      // frameProportion={0.15}
      // animationFramesPerUpdate={2}
      // animationDelay={1000}
    />
  );
};

export default App;
