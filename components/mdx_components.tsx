import {
  Children,
  createElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MDXComponents } from "https://esm.sh/@types/mdx/types.d.ts";
import { clsx, isString } from "~/deps.ts";
import { isReactElement } from "~/util.ts";

const Code: MDXComponents["code"] = (props) => {
  if (isString(props.children)) {
    return createElement("code", {
      ...props,
      className:
        "text-xl px-1 rounded bg-gray-100 border py-0.5 border-gray-200/50",
    });
  }

  const ref = useRef<HTMLElement>(null);

  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (!ref.current || !isWaiting) return;

    globalThis.navigator.clipboard.writeText(
      ref.current.innerText,
    );

    const id = setTimeout(() => {
      setIsWaiting(false);
    }, 4000);
    return () => clearTimeout(id);
  }, [isWaiting]);

  const icon = useMemo<string>(
    () => isWaiting ? "i-mdi-check text-teal-500" : "i-mdi-content-copy",
    [isWaiting],
  );
  const className = useMemo<string>(
    () => clsx("transition-all duration-300", icon),
    [icon],
  );

  return (
    <>
      <code {...props} ref={ref} />
      <div
        role="toolbar"
        className="absolute opacity-30 transition-opacity duration-500 group-hover:opacity-100 bottom-0 right-0 p-2"
      >
        <button
          onClick={() => setIsWaiting(true)}
          className="-mx-2 sm:mx-0 inline-flex p-1.5 border transition duration-300 focus:outline-none focus:ring backdrop-blur bg-white/20 text-white border-white/20 rounded-md"
        >
          <span className={className} />
        </button>
      </div>
    </>
  );
};

const MDXComponents: MDXComponents = {
  h1: (props) => {
    return createElement("h1", { ...props, className: "text-2xl" });
  },
  h2: (props) => {
    return createElement("h2", { ...props, className: "text-xl mt-10" });
  },
  pre: (props) =>
    createElement("pre", { className: "relative group", ...props }),
  code: Code,
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
