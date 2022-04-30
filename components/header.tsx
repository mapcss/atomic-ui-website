import { forwardRef, useContext } from "react";
import { Tooltip, TooltipProvider, Transition } from "@atomic_ui_react/mod.ts";
import ToggleDark from "~/components/toggle_dark.tsx";
import { fade } from "~/utils/transition.ts";
import NavigationDrawerContext from "~/contexts/react/navigation_drawer.ts";

const tooltipClassName =
  "absolute text-sm bg-gray-50 dark:bg-dark-800 px-1 border border-gray-200 dark:border-dark-200 left-1/2 transform -translate-x-1/2 whitespace-nowrap rounded-md -bottom-6 mx-auto";

export default function Header(): JSX.Element {
  return (
    <header className="px-5 relative z-1 py-2 sticky top-0 backdrop-blur-md border-b bg-white/50 dark:bg-dark-900 border-white/30 dark:border-dark-200">
      <div className="container mx-auto 2xl:px-34 flex justify-between items-center">
        <a href="/">
          <h1 className="xl:px-4 text-xl leading-relaxed">
            Atomic UI
          </h1>
        </a>

        <div role="toolbar" className="space-x-4 flex items-center">
          <ToggleDark />
          <TooltipProvider>
            {({ ref, isShow }) => (
              <>
                <NavigationButton ref={ref} className="md:hidden" />
                <Transition
                  {...fade}
                  isShow={isShow}
                >
                  <Tooltip className={tooltipClassName}>
                    Menu
                  </Tooltip>
                </Transition>
              </>
            )}
          </TooltipProvider>
          <TooltipProvider
            wrapper={({ ref, ...props }) => (
              <div className="relative hidden md:block" {...props} />
            )}
          >
            {({ ref, isShow }) => (
              <>
                <a
                  ref={ref}
                  href="https://github.com/mapcss/atomic-ui-react"
                  target="_blank"
                  className="hover:opacity-50 transition duration-300 i-mdi-github w-6 h-6"
                />
                <Transition {...fade} isShow={isShow}>
                  <Tooltip className={tooltipClassName}>GitHub</Tooltip>
                </Transition>
              </>
            )}
          </TooltipProvider>
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
    <button ref={ref} {...props} onClick={on}>
      <span className="i-charm-menu-hamburger w-6 h-6" />
    </button>
  );
});
