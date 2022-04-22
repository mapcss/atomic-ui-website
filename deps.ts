import { ReactElement, ReactNode } from "react";
import { isObject } from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";
export { isString } from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";

export function isReactElement(value: ReactNode): value is ReactElement {
  return isObject(value);
}
