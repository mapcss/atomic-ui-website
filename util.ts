import { isObject } from "~/deps.ts";
import { ReactElement, ReactNode } from "react";

export function isReactElement(value: ReactNode): value is ReactElement {
  return isObject(value);
}

export function hasChildren(
  reactElement: ReactElement,
): reactElement is ReactElement<{ children: ReactNode }> {
  return "children" in reactElement.props;
}

export function capitalize<T extends string>(value: T): Capitalize<T> {
  const [first, ...rest] = value;
  return first.toUpperCase() +
    rest.map((v) => v.toLowerCase()).join("") as never;
}
