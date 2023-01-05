import { FC } from "react";
import styled from "styled-components";

import LEDMessageSign from "./components/LEDMessageSign";

// TODO: Try to put some gradient over glow

const App: FC = () => {
  return (
    <Container>
      <LEDMessageSign
        text="Bilbo Birnir Gunnarsson Toftum"
        // height={250}
        // width={500}
        // fullWidth
        // hueDegrees={100}
        // multiColor
        // frameProportion={0.15}
        // animationFramesPerUpdate={30}
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
