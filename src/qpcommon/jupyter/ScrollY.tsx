import { FunctionComponent, PropsWithChildren } from "react";

const ScrollY: FunctionComponent<
  PropsWithChildren<{
    width: number;
    height: number;
    left?: number;
    top?: number;
    dataTestId?: string;
  }>
> = ({ width, height, children, left = 0, top = 0, dataTestId }) => {
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        overflowY: "auto",
        left,
        top,
      }}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};

export default ScrollY;
