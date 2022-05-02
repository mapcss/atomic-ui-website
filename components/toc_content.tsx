import { DependencyList, useContext, useEffect, useState } from "react";
import { clsx } from "~/deps.ts";
import TOC from "~/components/toc.tsx";
import HashLink from "~/components/hash_link.tsx";
import ArticleRefContext from "~/contexts/react/article_ref.ts";
import { filterTruthy } from "@atomic_ui_react/deps.ts";
import type {
  TableOfContents,
} from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";

type Props = {
  children?: TableOfContents;
};

export default function TOCContent({ children }: Props): JSX.Element {
  const ref = useContext(ArticleRefContext);
  const _children = {
    items: filterTruthy(children?.items?.map(({ items }) => items) ?? [])
      .flat(),
  };
  const [activeId, setActiveId] = useState<string | undefined>();
  useIntersection(() =>
    new IntersectionObserver((entry) => {
      entry.forEach(({ target, isIntersecting }) => {
        const children = target.firstElementChild;
        if (!children) return;
        const id = `#${children.id}`;
        if (isIntersecting) {
          setActiveId(id);
        }
      });
    }, { root: null, rootMargin: "-50% 0px", threshold: 0 }), () => {
    if (!ref.current) return;
    const el = ref.current.querySelectorAll("section > h2, section > h3");
    const sections = filterTruthy(Array.from(el).map((a) => a.parentElement));
    return sections;
  }, [JSON.stringify(children)]);

  return (
    <TOC
      depth={2}
      ul={({ className, ...rest }, { depth }) => (
        <ul
          {...rest}
          className={clsx(className, "text-sm leading-6", 2 < depth && "pl-3")}
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
      children={_children}
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
