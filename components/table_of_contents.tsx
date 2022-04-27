import HashLink from "~/components/hash_link.tsx";
import { clsx } from "../deps.ts";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";

export default function Toc(
  { children, depth = 1 }: { children?: TableOfContents; depth?: number },
): JSX.Element {
  return children?.items?.length
    ? (
      <ul className={clsx("text-sm leading-6", 1 < depth && "pl-3")}>
        {children.items.map((item) => {
          return (
            <li key={item.title}>
              <HashLink
                className="block py-1 font-medium"
                href={item.url}
              >
                {item.title}
              </HashLink>
              {item.items?.length
                ? <Toc children={item} depth={depth + 1} />
                : null}
            </li>
          );
        })}
      </ul>
    )
    : <></>;
}
