import { memo, useRef } from "react";
import { dynamic } from "aleph/react";
import { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";
import MDXComponents from "~/components/mdx_components.tsx";
import {
  Disclosure,
  Transition,
  useBoolean,
  useOutside,
  WithDisclosureTarget,
  WithDisclosureTrigger,
} from "@atomic_ui_react/mod.ts";
import _Header from "~/components/header.tsx";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";
import _TOCContent from "~/components/toc_content.tsx";
import NavigationDrawerContext from "~/contexts/react/navigation_drawer.ts";
import ArticleRefContext from "~/contexts/react/article_ref.ts";
import Toolbar from "~/components/toolbar.ts";
import { fade } from "~/utils/transition.ts";
import { clsx } from "~/deps.ts";

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
      meta: {
        title: string;
      };
    };
  },
): JSX.Element {
  if (!Page) return <></>;

  const [isShow, { on, off, toggle }] = useBoolean();
  const ref = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  useOutside(
    {
      target: ref,
      callback: off,
      event: "mousedown",
    },
    undefined,
    [],
  );

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

        <Header className="h-[50px] sticky top-0 z-1 flex justify-center px-5 sm:px-12 lg:px-4 xl:px-0 backdrop-blur-md border-b bg-white/50 dark:bg-dark-900 border-white/30 dark:border-dark-200" />

        <div className="max-w-7xl px-5 sm:px-12 lg:px-4 xl:px-0 mx-auto grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] justify-center grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]">
          <div className="order-2 md:py-8">
            <nav>
              <ol className="space-x-2 flex items-center">
                {[{ name: "Home", path: "/react" }, {
                  name: pageProps?.meta.title,
                }].map(({ name, path }, i) => {
                  return (
                    <li
                      className="space-x-1 inline-flex items-center"
                      key={name}
                    >
                      {!!i && <span className="i-mdi-chevron-right" />}
                      <a href={path}>{name}</a>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <Disclosure>
              <WithDisclosureTrigger>
                {(attrs, { isOpen }) => (
                  <button
                    {...attrs}
                    className="flex w-full justify-center items-center xl:hidden space-x-2 rounded p-1 dark:border-dark-200 my-4"
                  >
                    <span className="uppercase">
                      Table Of Contents
                    </span>

                    <span
                      className={clsx(
                        "i-mdi-chevron-down w-5 h-5 transition transform duration-300",
                        { "-rotate-180": !isOpen },
                      )}
                    />
                  </button>
                )}
              </WithDisclosureTrigger>

              <WithDisclosureTarget>
                {(props, { isOpen }) => (
                  <Transition {...fade} isShow={isOpen}>
                    <nav {...props} className="lg:hidden my-4">
                      <TOCContent children={pageProps?.tableOfContents} />
                    </nav>
                  </Transition>
                )}
              </WithDisclosureTarget>
            </Disclosure>

            <main className="mt-8">
              <article
                ref={articleRef}
                className="prose"
              >
                <Page components={MDXComponents} />
              </article>
            </main>
          </div>

          <aside className="hidden py-8 sticky top-[50px] md:block order-1 max-h-screen h-full">
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

          <aside className="lg:sticky py-8 lg:top-[50px] hidden lg:block order-1 md:order-3 max-h-screen h-full">
            <h3 className="hidden md:block">
              On this page
            </h3>

            <nav>
              <TOCContent children={pageProps?.tableOfContents} />
            </nav>
          </aside>
        </div>
      </ArticleRefContext.Provider>
    </NavigationDrawerContext.Provider>
  );
}
