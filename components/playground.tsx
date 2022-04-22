import { MouseEventHandler, ReactNode, useMemo, useRef } from "react";
import { Tab, TabList, TabPanel, TabProvider } from "@atomic_ui_react/mod.ts";

type Props = {
  isCopyable: boolean;
  preview: ReactNode;
  children: ReactNode;
  inheritHeight: boolean;
};

export default function Playground(
  { preview, isCopyable = true, children, inheritHeight = true }: Readonly<
    Partial<Props>
  >,
): JSX.Element {
  const ref = useRef<HTMLElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleClick = useMemo<MouseEventHandler>(() => {
    return () => {
      if (!isCopyable) return;
      const target = ref.current?.children.item(1);

      if (isHTMLElement(target)) {
        globalThis.navigator.clipboard.writeText(
          target.innerText,
        );
      }
    };
  }, [isCopyable]);

  return (
    <>
      <div ref={tabListRef} className="relative my-4">
        <TabProvider>
          <TabList className="absolute text-white p-2 space-x-1 right-0">
            <Tab className="transition duration-300 px-2 py-0.5 focus:outline-none focus:ring text-sm rounded-l-md rounded-r-sm bg-white/20 backdrop-blur border border-white/20">
              Preview
            </Tab>
            <Tab className="transition duration-300 px-2 py-0.5 focus:outline-none focus:ring text-sm rounded-r-md rounded-l-sm bg-white/20 backdrop-blur border border-white/20">
              Code
            </Tab>
          </TabList>

          <TabPanel className="grid place-content-center -mx-2 sm:mx-0 p-20 from-red-500 bg-gradient-to-bl via-red-400 to-red-300 sm:rounded-xl shadow border border-red-600">
            {preview}
          </TabPanel>
          <TabPanel ref={ref} className="-mx-2 sm:mx-0">
            <div role="toolbar" className="absolute right-0 bottom-0 p-2">
              {isCopyable &&
                (
                  <button
                    onClick={handleClick}
                    className="border backdrop-blur bg-white/20 text-white border-white/20 p-1 rounded-md"
                  >
                    Copy
                  </button>
                )}
            </div>
            {children}
          </TabPanel>
        </TabProvider>
      </div>
    </>
  );
}

function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}
