import {
  Children,
  cloneElement,
  CSSProperties,
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Tab, TabList, TabPanel, TabProvider } from "@atomic_ui_react/mod.ts";
import { isFunction, isNumber, isObject, isString } from "~/deps.ts";
import { hasChildren, isReactElement } from "~/util.ts";

type Props = {
  preview: ReactNode;
  children: ReactNode;
  inheritHeight: boolean;
};

export default function Playground(
  { preview, children, inheritHeight = true }: Readonly<
    Partial<Props>
  >,
): JSX.Element {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>();

  const modifiedChildren = useMemo<ReactNode>(
    () => inheritHeight ? removeHljsClassName(children) : children,
    [children, inheritHeight],
  );

  useEffect(() => {
    if (!inheritHeight || !wrapperRef.current) return;
    setHeight(wrapperRef.current.clientHeight);
  });

  const style = useMemo<CSSProperties | undefined>(() => {
    return isNumber(height)
      ? {
        maxHeight: `${height}px`,
        overflow: "scroll",
      }
      : undefined;
  }, [height]);

  return (
    <>
      <div ref={wrapperRef} className="relative my-4">
        <TabProvider>
          <TabList className="absolute text-white p-2 space-x-1 right-0">
            <Tab className="transition duration-300 px-2 py-0.5 focus:outline-none focus:ring text-sm rounded-l-md rounded-r-sm bg-white/20 backdrop-blur border border-white/20">
              Preview
            </Tab>
            <Tab className="transition duration-300 px-2 py-0.5 focus:outline-none focus:ring text-sm rounded-r-md rounded-l-sm bg-white/20 backdrop-blur border border-white/20">
              Code
            </Tab>
          </TabList>

          <TabPanel className="grid place-content-center -mx-5 sm:mx-0 p-20 from-red-500 bg-gradient-to-bl via-red-400 to-red-300 sm:rounded-xl shadow border border-red-600">
            {preview}
          </TabPanel>
          <TabPanel className="-mx-5 sm:mx-0 hljs" style={style}>
            {modifiedChildren}
          </TabPanel>
        </TabProvider>
      </div>
    </>
  );
}

/** remove `hljs` className what attached by Highlight.js */
function removeHljsClassName(value: ReactNode): ReactNode {
  const children = Children.map(value, (child) => {
    if (
      !isReactElement(child) ||
      !(isTypePre(child) || isFunction(child.type)) || !hasChildren(child)
    ) {
      return child;
    }

    const grandChildren = Children.map(child.props.children, (child) => {
      if (
        !isReactElement(child) ||
        !(isTypeCode(child) || isFunction(child.type)) ||
        !(hasClassNameProp(child) || hasClassName(child, "hljs"))
      ) {
        return child;
      }

      const className = child.props.className.replaceAll("hljs", "")
        .trim();

      const newChild = cloneElement(child, { className });

      return newChild;
    });

    const newChild = cloneElement(
      child as ReactElement<{
        children: ReactNode;
        className: string;
      }>,
      {
        children: grandChildren,
        className: "p-3.5 group",
      },
    );
    return newChild;
  });

  return children;
}

function isTypePre(value: ReactElement): value is ReactElement<unknown, "pre"> {
  return value.type === "pre";
}

function isTypeCode(
  value: ReactElement,
): value is ReactElement<unknown, "code"> {
  return value.type === "code";
}

function hasClassNameProp(
  value: ReactElement,
): value is ReactElement<{ className: string }> {
  if (!isObject(value.props)) return false;
  return "className" in value.props &&
    // deno-lint-ignore no-explicit-any
    isString((value.props as any).className);
}

function hasClassName(
  value: ReactElement<{ className: string }>,
  className: string,
): boolean {
  return value.props.className.includes(className);
}
