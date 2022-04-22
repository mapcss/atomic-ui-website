import { ReactElement, ReactNode } from "react";
import { isObject } from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export {
  isFunction,
  isNumber,
  isObject,
  isString,
} from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export { default as clsx } from "https://esm.sh/clsx@1.1.1?pin=v77";

export function isReactElement(value: ReactNode): value is ReactElement {
  return isObject(value);
}

export function hasChildren(
  reactElement: ReactElement,
): reactElement is ReactElement<{ children: ReactNode }> {
  return "children" in reactElement.props;
}
