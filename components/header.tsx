import { forwardRef, useContext } from "react";
import {
  Tooltip,
  TooltipContainer,
  TooltipTrigger,
} from "@atomic_ui_react/mod.ts";
import ToggleDark from "~/components/toggle_dark.tsx";
import { clsx } from "~/deps.ts";
import NavigationDrawerContext from "~/contexts/react/navigation_drawer.ts";

const tooltipClassName =
  "absolute text-sm bg-gray-50 dark:bg-dark-800 px-1 border border-gray-200 dark:border-dark-200 left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded-md -bottom-6 mx-auto";

export type Props = JSX.IntrinsicElements["header"];
export default function Header(
  { className, ...rest }: Props,
): JSX.Element {
  return (
    <header
      {...rest}
      className={clsx(
        className,
      )}
    >
      <div className="max-w-7xl w-full flex justify-between items-center">
        <a href="/">
          <h1 className="text-xl leading-relaxed">
            Atomic UI
          </h1>
        </a>

        <div role="toolbar" className="space-x-4 flex items-center">
          <ToggleDark />
          <TooltipContainer>
            <TooltipTrigger className="md:hidden rounded inline-flex items-center backdrop-blur p-1 border-white/30 dark:border-dark-200" />

            <Tooltip className={tooltipClassName}>
              Menu
            </Tooltip>
          </TooltipContainer>
          <TooltipContainer className="hidden md:block">
            <TooltipTrigger
              as="a"
              href="https://github.com/mapcss/atomic-ui-react"
              target="_blank"
              className="hover:opacity-50 transition duration-300 i-mdi-github w-6 h-6"
            />
            <Tooltip className={tooltipClassName}>GitHub</Tooltip>
          </TooltipContainer>
        </div>
      </div>
    </header>
  );
}

const NavigationButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"]
>((props, ref) => {
  const [_, { on }] = useContext(NavigationDrawerContext);
  return (
    <button
      ref={ref}
      {...props}
      onClick={on}
    >
      <span className="i-charm-menu-hamburger w-6 h-6" />
    </button>
  );
});
