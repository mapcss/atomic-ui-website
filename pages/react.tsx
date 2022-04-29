import { memo, useRef } from "react";
import { dynamic } from "aleph/react";
import { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";
import MDXComponents from "~/components/mdx_components.tsx";
import { Transition, useBoolean } from "@atomic_ui_react/mod.ts";
import useClickOutside from "~/hooks/use_click_outside.ts";
import ToggleDark from "~/components/toggle_dark.tsx";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";
import TOCContent from "~/components/toc_content.tsx";

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
const Head = memo(_Head);

export default function Index(
  { Page, pageProps }: {
    Page?: MDXContent;
    pageProps: {
      tableOfContents?: TableOfContents;
    };
  },
): JSX.Element {
  if (!Page) return <></>;

  const [isShow, { on, off }] = useBoolean();
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, off, "mousedown");

  return (
    <>
      <Head />
      <Portal>
        <Transition
          enter="transition duration-300"
          enterFrom="opacity-0 backdrop-blur"
          enterTo="backdrop-blur-md"
          entered="backdrop-blur-md"
          leaveFrom="backdrop-blur-md"
          leave="transition duration-300"
          leaveTo="opacity-0 backdrop-blur"
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
              immediate
              isShow={isShow}
            >
              <div
                ref={ref}
                className="w-2/3 min-w-[260px] max-w-xs h-full bg-gray-100 dark:bg-dark-900 border-r border-gray-200 dark:border-dark-200"
              >
                <nav className="p-2">
                  <ul>
                    {navLinks.map(({ name, path }) => {
                      return (
                        <li key={name}>
                          <a href={path} onClick={off} className="uppercase">
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

      <header className="px-5 relative z-1 py-2 sticky top-0 backdrop-blur-md border-b bg-white/50 dark:bg-dark-900 border-white/30 dark:border-dark-200">
        <div className="container mx-auto 2xl:px-34 flex justify-between items-center">
          <a href="/">
            <h1 className="xl:px-4 text-xl leading-relaxed">
              Atomic UI
            </h1>
          </a>

          <div role="toolbar" className="space-x-4 flex items-center">
            <ToggleDark />
            <button className="md:hidden" onClick={on}>
              <span className="i-charm-menu-hamburger w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="container relative z-auto mx-auto grid justify-center grid-cols-1 md:grid-cols-[260px_minmax(0,65ch)] xl:grid-cols-[300px_minmax(auto,65ch)_300px]">
        <article className="prose px-5 order-2 lg:px-8 py-4">
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

          <TOCContent children={pageProps.tableOfContents} />
        </aside>
      </main>
    </>
  );
}
