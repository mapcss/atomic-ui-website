import { MouseEventHandler } from "react";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";

export default function Toc(
  { children }: { children?: TableOfContents },
): JSX.Element {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    const href = e.currentTarget.href;
    const hash = new URL(href).hash.replace("#", "");
    const target = document.getElementById(hash);

    target?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return children?.items?.length
    ? (
      <ul className="text-sm leading-6">
        {children.items.map((item) => {
          return (
            <li key={item.title}>
              <a
                className="block py-1 font-medium"
                href={item.url}
                onClick={handleClick}
              >
                {item.title}
              </a>
              {item.items?.length ? <Toc children={item} /> : null}
            </li>
          );
        })}
      </ul>
    )
    : <></>;
}
