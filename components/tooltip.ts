import { createElement, forwardRef } from "react";

const Tooltip = forwardRef<HTMLSpanElement, JSX.IntrinsicElements["span"]>(
  (props, ref) => {
    const role = "tooltip";
    return createElement("span", { role, ref, ...props });
  },
);

export default Tooltip;
