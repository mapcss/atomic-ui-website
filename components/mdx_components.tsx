import {
  Children,
  createElement,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from "react";
import { MDXComponents } from "https://esm.sh/@types/mdx/types.d.ts";
import { clsx, isString } from "~/deps.ts";
import HashLink from "~/components/hash_link.tsx";
import { isReactElement } from "~/util.ts";
import { useTimeout } from "@atomic_ui_react/mod.ts";

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

  useTimeout(
    () => {
      if (!ref.current || !isWaiting) return;
      globalThis.navigator.clipboard.writeText(
        ref.current.innerText,
      );
      setIsWaiting(false);
    },
    { ms: 4000 },
    [isWaiting],
  );

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
          className="sm:mx-0 inline-flex p-1.5 border transition duration-300 focus:outline-none focus:ring backdrop-blur bg-white/20 text-white border-white/20 rounded-md"
        >
          <span className={className} />
        </button>
      </div>
    </>
  );
};

const hashLinkClassName =
  "hidden sm:inline-flex absolute transition duration-300 delay-200 transform -translate-x-full border border-gray-100 rounded-md p-1 -ml-2 opacity-0 group-hover:opacity-100";

const MDXComponents: MDXComponents = {
  h1: ({ children, ...props }) => {
    return (
      <h1 {...props} className="text-2xl relative group">
        <HashLink
          href={`#${props.id}`}
          className={hashLinkClassName}
        >
          <span className="i-mdi-link-variant w-5 h-5" />
        </HashLink>

        <span>{children}</span>
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    return (
      <h2 {...props} className="text-xl mt-10 relative group">
        <HashLink
          href={`#${props.id}`}
          className={hashLinkClassName}
        >
          <span className="i-mdi-link-variant w-5 h-5" />
        </HashLink>

        <span>{children}</span>
      </h2>
    );
  },
  a: (props) => {
    const type = isFootnote(props) ? HashLink : "a";
    return createElement(type, props);
  },
  pre: (props) =>
    createElement("pre", {
      className: "relative group -mx-5 sm:mx-0",
      ...props,
    }),
  code: Code,
  table: (props) =>
    createElement("table", { ...props, className: "-mx-5 sm:mx-0 my-4" }),
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

function isFootnote(
  props:
    & React.DetailedHTMLProps<
      React.AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >
    & { "data-footnote-ref"?: boolean; "data-footnote-backref"?: boolean },
): boolean {
  return props["data-footnote-ref"] === true ||
    props["data-footnote-backref"] === true;
}

export default MDXComponents;
