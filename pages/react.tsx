import { memo, useRef } from "react";
import { dynamic } from "aleph/react";
import { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";
import MDXComponents from "~/components/mdx_components.tsx";
import { Transition, useBoolean } from "@atomic_ui_react/mod.ts";
import useClickOutside from "~/hooks/use_click_outside.ts";
import _Header from "~/components/header.tsx";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";
import _TOCContent from "~/components/toc_content.tsx";
import NavigationDrawerContext from "~/contexts/react/navigation_drawer.ts";
import ArticleRefContext from "~/contexts/react/article_ref.ts";
import Toolbar from "~/components/toolbar.ts";

const Head = memo(_Head);
const Header = memo(_Header);
const TOCContent = memo(_TOCContent);

const Portal = dynamic(() => import("~/components/portal.tsx"));

type NavLink = {
  name: string;
  path: string;
};
const navLinks: NavLink[] = [{
  name: "Transition",
  path: "/react/transition",
}, {
  name: "Switch",
  path: "/react/switch",
}, {
  name: "Disclosure",
  path: "/react/disclosure",
}];

function _Head(): JSX.Element {
  return (
    <head>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark.min.css"
      />
      <link
        rel="stylesheet"
        href="~/style/highlight.css"
      />
    </head>
  );
}

export default function Index(
  { Page, pageProps }: {
    Page?: MDXContent;
    pageProps?: {
      tableOfContents?: TableOfContents;
    };
  },
): JSX.Element {
  if (!Page) return <></>;

  const [isShow, { on, off, toggle }] = useBoolean();
  const ref = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  useClickOutside(ref, off, "mousedown");

  return (
    <NavigationDrawerContext.Provider value={[isShow, { on, off, toggle }]}>
      <ArticleRefContext.Provider value={articleRef}>
        <Head />
        <Portal>
          <Transition
            enter="transition duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="backdrop-blur"
            entered="backdrop-blur"
            leaveFrom="backdrop-blur"
            leave="transition duration-300"
            leaveTo="backdrop-blur-none"
            leaved="backdrop-blur-none"
            isShow={isShow}
          >
            <div className="fixed z-1 inset-0">
              <head>
                <style>
                  {`
            html{
              overflow: hidden
            }`}
                </style>
              </head>
              <Transition
                enter="transform transition duration-300"
                enterFrom="-translate-x-full"
                leave="transform transition duration-300"
                leaveTo="-translate-x-full"
                isRoot={false}
                immediate
              >
                <div
                  ref={ref}
                  className="w-2/3 min-w-[300px] max-w-xs h-full bg-gray-100 dark:bg-dark-900 border-r border-gray-200 dark:border-dark-200"
                >
                  <Toolbar className="border-b border-gray-200 dark:border-dark-200 flex justify-end px-2 py-1">
                    <button
                      onClick={off}
                      className="border inline-flex items-center border border-gray-200 dark:border-dark-200 p-1 rounded"
                    >
                      <span className="w-6 h-6 i-mdi-close" />
                    </button>
                  </Toolbar>
                  <nav className="p-2">
                    <ul>
                      {navLinks.map(({ name, path }) => {
                        return (
                          <li key={name}>
                            <a href={path} className="block" onClick={off}>
                              {name}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </Transition>
            </div>
          </Transition>
        </Portal>

        <Header />

        <main className="container relative z-auto mx-auto grid justify-center grid-cols-1 md:grid-cols-[260px_minmax(0,65ch)] xl:grid-cols-[300px_minmax(auto,65ch)_300px]">
          <article ref={articleRef} className="prose px-5 order-2 lg:px-8 py-4">
            <Page components={MDXComponents} />
          </article>

          <aside className="hidden sticky top-[50px] md:block order-1 max-h-screen h-full p-4">
            <nav>
              <ul>
                {navLinks.map(({ name, path }) => {
                  return (
                    <li key={name}>
                      <a href={path}>
                        {name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <aside className="xl:sticky xl:top-[50px] md:hidden xl:block order-1 md:order-3 max-h-screen h-full p-4">
            <h3>On this page</h3>

            <TOCContent children={pageProps?.tableOfContents} />
          </aside>
        </main>
      </ArticleRefContext.Provider>
    </NavigationDrawerContext.Provider>
  );
}
