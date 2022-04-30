import { cloneElement, RefObject, useEffect, useRef } from "react";
import { useBoolean } from "@atomic_ui_react/mod.ts";

// deno-lint-ignore no-explicit-any
export type Props<R = any> = {
  wrapper?: (props: JSX.IntrinsicElements["div"]) => JSX.Element;
  children: (
    context: {
      isShow: boolean;
      ref: RefObject<R>;
    },
  ) => JSX.Element;
};
export default function TooltipProvider(
  {
    children,
    wrapper = (props) => <div style={{ position: "relative" }} {...props} />,
  }: Props,
): JSX.Element {
  const ref = useRef<Element>(null);
  const [state, { on, off }] = useBoolean();

  useEffect(() => {
    if (!ref.current) return;

    ref.current.addEventListener("mouseenter", on, { passive: true });
    ref.current.addEventListener("mouseleave", off, { passive: true });

    return () => {
      if (!ref.current) return;
      ref.current.removeEventListener("mouseenter", on);
      ref.current.removeEventListener("mouseleave", off);
    };
  }, []);

  return wrapper({
    children: cloneElement(children({ isShow: state, ref })),
  });
}
