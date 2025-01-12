import React, { FC, memo } from "react";

import { BaseProps } from "~/types";

const LEDImageSign: FC<BaseProps> = ({
  style = {},
  className,
  // ...props
}) => {
  return <div style={{ color: "red" }}>LEDImageSign</div>;
};

export default memo(LEDImageSign);
