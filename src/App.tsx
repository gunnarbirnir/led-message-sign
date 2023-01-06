import { FC } from "react";
import styled from "styled-components";

import LEDMessageSign from "./components/LEDMessageSign";

// TODO: UI to change props. Add to URL.

const App: FC = () => {
  return (
    <Container>
      <LEDMessageSign
        text="LED Message Sign"
        // height={50}
        // width={500}
        // fullWidth
        // colorHue={180}
        multiColor
        // hideFrame
        // animationFramesPerUpdate={30}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: hsl(0deg 0% 0%);
`;

export default App;
