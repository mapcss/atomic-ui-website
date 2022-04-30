import { createContext } from "react";
import { UseBooleanReturnValue } from "@atomic_ui_react/mod.ts";
import { noop } from "~/deps.ts";

const Context = createContext<[boolean, UseBooleanReturnValue[1]]>([false, {
  on: noop,
  off: noop,
  toggle: noop,
}]);
export default Context;
