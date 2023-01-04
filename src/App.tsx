import { FC } from "react";
import styled from "styled-components";

import LEDMessageSign from "./components/LEDMessageSign";

// TODO: Remove glow before light appear and add glow after last letter
// TODO: Try to put some gradient over glow

const App: FC = () => {
  return (
    <Container>
      <LEDMessageSign
        text="LED Message Sign"
        // height={100}
        // width={500}
        fullWidth
        // hueDegrees={100}
        // multiColor
        // frameProportion={0.15}
        animationFramesPerUpdate={60}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: hsl(0deg 0% 0%);
`;

export default App;
