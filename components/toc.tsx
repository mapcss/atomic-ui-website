import { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes } from "react";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";

type Depth = 1 | 2 | 3 | 4 | 5 | 6;

type Context = { depth: Depth };

export type Props = {
  children?: TableOfContents;
  depth?: number;

  ul?: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLUListElement>,
      HTMLUListElement
    >,
    context: Context,
  ) => JSX.Element;
  li?: (
    props: DetailedHTMLProps<
      HTMLAttributes<HTMLLIElement>,
      HTMLLIElement
    >,
    context: Context,
  ) => JSX.Element;
  a?: (
    props: DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >,
    context: Context,
  ) => JSX.Element;
};

export default function Toc(
  {
    children,
    depth = 1,
    ul = (props) => <ul {...props} />,
    li = (props) => <li {...props} />,
    a = (props) => <a {...props} />,
  }: Props,
): JSX.Element {
  if (
    !children || !children.items || !children.items.length ||
    !isValidDepth(depth)
  ) {
    return <></>;
  }
  return ul({
    children: children.items.map((item) => {
      return (
        li({
          key: item.title,
          children: (
            <>
              {a({ href: item.url, children: item.title }, {
                depth,
              })}

              {item.items?.length
                ? (
                  <Toc
                    children={item}
                    depth={depth + 1}
                    a={a}
                    ul={ul}
                    li={li}
                  />
                )
                : null}
            </>
          ),
        }, { depth })
      );
    }),
  }, { depth });
}

function isValidDepth(value: number): value is Depth {
  return [1, 2, 3, 4, 5, 6].includes(value);
}
