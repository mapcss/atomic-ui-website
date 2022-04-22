import {
  Children,
  createElement,
  MouseEventHandler,
  ReactNode,
  useRef,
} from "react";
import { MDXComponents } from "https://esm.sh/@types/mdx/types.d.ts";
import { isReactElement, isString } from "~/deps.ts";

const MDXComponents: MDXComponents = {
  h1: (props) => {
    return createElement("h1", { ...props, className: "text-2xl" });
  },
  h2: (props) => {
    return createElement("h2", { ...props, className: "text-xl mt-10" });
  },
  pre: (props) => createElement("pre", { className: "relative", ...props }),
  code: (props) => {
    if (isString(props.children)) {
      return createElement("code", {
        ...props,
        className:
          "text-xl px-1 rounded bg-gray-100 border py-0.5 border-gray-200/50",
      });
    }

    const ref = useRef<HTMLElement>(null);

    const handleClick: MouseEventHandler = () => {
      if (!ref.current) return;

      globalThis.navigator.clipboard.writeText(
        ref.current.innerText,
      );
    };
    return (
      <>
        <code {...props} ref={ref} />
        <div role="toolbar" className="absolute bottom-0 right-0 p-2">
          <button
            onClick={handleClick}
            className="border transition duration-300 focus:outline-none focus:ring backdrop-blur bg-white/20 text-white border-white/20 p-1 rounded-md"
          >
            Copy
          </button>
        </div>
      </>
    );
  },
  thead: (props) =>
    createElement("tbody", {
      ...props,
      className: "border-b-2 border-gray-200",
    }),
  tbody: (props) =>
    createElement("tbody", { ...props, className: "divide-y divide-gray-200" }),
  tr: (props) => {
    const className = isTHeadTh(props.children)
      ? undefined
      : "hover:bg-gray-100 transition-colors";
    return createElement("tr", { ...props, className });
  },
};

function isTHeadTh(
  children: ReactNode,
): children is JSX.IntrinsicElements["th"] {
  for (const reactNode of Children.toArray(children)) {
    if (isReactElement(reactNode)) {
      return reactNode.type === "th";
    }
  }
  return false;
}

export default MDXComponents;
