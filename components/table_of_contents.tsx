import HashLink from "~/components/hash_link.tsx";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";

export default function Toc(
  { children }: { children?: TableOfContents },
): JSX.Element {
  return children?.items?.length
    ? (
      <ul className="text-sm leading-6">
        {children.items.map((item) => {
          return (
            <li key={item.title}>
              <HashLink
                className="block py-1 font-medium"
                href={item.url}
              >
                {item.title}
              </HashLink>
              {item.items?.length ? <Toc children={item} /> : null}
            </li>
          );
        })}
      </ul>
    )
    : <></>;
}
