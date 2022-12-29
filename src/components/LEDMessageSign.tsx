import { FC, memo } from "react";

import { LEDMessageSignProps } from "../types";
import { sanitizeProps } from "../utils";

const LEDMessageSign: FC<LEDMessageSignProps> = (props) => {
  const { text } = sanitizeProps(props);

  return <p>{text}</p>;
};

export default memo(LEDMessageSign);
