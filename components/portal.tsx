import { ReactNode } from "react";
import { Lazyable, lazyEval } from "@atomic_ui_react/mod.ts";

import { createPortal } from "react-dom";

export default function Portal(
  {
    children,
    container = () => globalThis.document.getElementsByTagName("body")[0],
  }: {
    children: ReactNode;
    container?: Lazyable<Element | null>;
  },
): JSX.Element {
  if (!container) return <></>;
  const el = lazyEval(container) as Element | null;
  const portal = el ? createPortal(children, el) : <></>;
  console.log(portal);
  return portal;
}
