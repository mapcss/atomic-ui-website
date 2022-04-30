import { DependencyList, useEffect, useRef, useState } from "react";
import { clsx } from "~/deps.ts";
import TOC from "~/components/toc.tsx";
import HashLink from "~/components/hash_link.tsx";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";

type Props = {
  children?: TableOfContents;
};

export default function TOCContent({ children }: Props): JSX.Element {
  const [activeId, setActiveId] = useState<string | undefined>();
  useIntersection(() =>
    new IntersectionObserver((entry) => {
      entry.forEach(({ target }) => {
        setActiveId(`#${target.id}`);
      });
    }), () => {
    const el = document.querySelectorAll("h2,h3");
    return el;
  }, []);

  return (
    <TOC
      ul={({ className, ...rest }, { depth }) => (
        <ul
          {...rest}
          className={clsx(className, "text-sm leading-6", 1 < depth && "pl-3")}
        />
      )}
      a={({ className, href, ...rest }) => {
        return (
          <HashLink
            {...rest}
            href={href}
            className={clsx(
              className,
              "block py-1 font-medium hover:opacity-50 transition",
              activeId === href && "text-amber-500",
            )}
          />
        );
      }}
      children={children}
    />
  );
}

function useIntersection(
  intersectionObserver: () => IntersectionObserver,
  target: () => Element | Iterable<Element> | undefined | null,
  deps?: DependencyList,
): void {
  useEffect(() => {
    const _target = target();
    if (!_target) return;
    const _intersectionObserver = intersectionObserver();

    const __target = _target instanceof Element ? [_target] : _target;

    Array.from(__target).forEach((el) => {
      _intersectionObserver.observe(el);
    });

    return () => {
      _intersectionObserver.disconnect();
    };
  }, deps);
}
