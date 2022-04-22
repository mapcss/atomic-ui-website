import { createElement, MouseEventHandler } from "react";

export const MouseHandlerOnHash: MouseEventHandler<HTMLAnchorElement> = (e) => {
  e.preventDefault();
  const href = e.currentTarget.href;
  const hash = new URL(href).hash.replace("#", "");
  const target = document.getElementById(hash);

  target?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

export default function HashLink<T extends JSX.IntrinsicElements["a"]>(
  { ...rest }: T,
): JSX.Element {
  return createElement("a", { onClick: MouseHandlerOnHash, ...rest });
}
