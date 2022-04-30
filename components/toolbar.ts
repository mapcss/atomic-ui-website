import { createElement, forwardRef, Ref } from "react";

function _Toolbar(
  props: JSX.IntrinsicElements["div"],
  ref: Ref<Element>,
): JSX.Element {
  return createElement("div", { role: "toolbar", ref, ...props });
}

const Toolbar = forwardRef(_Toolbar);

export default Toolbar;
