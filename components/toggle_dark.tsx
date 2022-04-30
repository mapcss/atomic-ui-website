import { useEffect, useState } from "react";
import {
  Switch,
  Tooltip,
  TooltipProvider,
  Transition,
  useIsomorphicLayoutEffect,
} from "@atomic_ui_react/mod.ts";
import { fade } from "~/utils/transition.ts";
import { clsx } from "~/deps.ts";
export default function ToggleDark(): JSX.Element {
  const [state, setState] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    const theme = globalThis.localStorage.getItem("theme");
    if (!theme) return;

    if (["dark", "light"].includes(theme)) {
      setState(theme === "dark" ? true : false);
    }
  }, []);

  useEffect(() => {
    if (state) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [state]);

  return (
    <TooltipProvider>
      {({ ref, isShow }) => (
        <>
          <Switch
            className={clsx(
              { "bg-dark-900": state, "bg-dark-100": !state },
              "inline-flex border box-content border-gray-500 dark:border-dark-200 items-center flex-shrink-0 w-[42px] p-0.5 rounded-full cursor-pointer ease-in-out focus:outline-none transition duration-300 focus:ring-2 focus:ring-opacity-75",
            )}
            ref={ref}
            isChecked={state}
            onChange={setState}
          >
            <span className="sr-only">Toggle dark</span>
            <span
              aria-hidden="true"
              className={`${state ? "translate-x-5" : "translate-x-0"}
            pointer-events-none inline-block h-[22px] w-[22px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
            />
          </Switch>
          <Transition {...fade} isShow={isShow}>
            <Tooltip className="absolute text-sm bg-gray-50 dark:bg-dark-800 px-1 border border-gray-200 dark:border-dark-200 left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded-md -bottom-6 mx-auto">
              Dark mode
            </Tooltip>
          </Transition>
        </>
      )}
    </TooltipProvider>
  );
}
