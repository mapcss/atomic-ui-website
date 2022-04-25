import { memo, useRef } from "react";
import { dynamic } from "aleph/react";
import { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";
import MDXComponents from "~/components/mdx_components.tsx";
import TOC from "~/components/table_of_contents.tsx";
import { TransitionProvider, useBoolean } from "@atomic_ui_react/mod.ts";
import useClickOutside from "~/hooks/use_click_outside.ts";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";

const Portal = dynamic(() => import("~/components/portal.tsx"));

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
        <TransitionProvider
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
            <TransitionProvider
              enter="transform transition duration-300"
              enterFrom="-translate-x-full"
              leave="transform transition duration-300"
              leaveTo="-translate-x-full"
              immediate
              isShow={isShow}
            >
              <div
                ref={ref}
                className="w-2/3 min-w-[260px] max-w-xs h-full bg-light-100 border-r border-gray-100"
              >
                <nav className="p-2">
                  <ul>
                    <li>
                      <a
                        onClick={off}
                        href="/react/transition"
                      >
                        Transition
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </TransitionProvider>
          </div>
        </TransitionProvider>
      </Portal>

      <header className="px-4 relative z-1 py-2 sticky top-0 backdrop-blur-md border-b bg-white/50 border-white/30">
        <div className="container mx-auto 2xl:px-34 flex justify-between items-center">
          <a href="/">
            <h1 className="xl:px-4 text-xl leading-relaxed">
              Atomic UI
            </h1>
          </a>

          <button className="md:hidden" onClick={on}>
            <span className="i-charm-menu-hamburger w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="container relative z-auto mx-auto flex justify-center">
        <aside className="hidden sticky top-[50px] md:block w-76 max-h-screen h-full flex-none p-4">
          <nav>
            <ul>
              <li>
                <a href="/react/transition">
                  Transition
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <article className="prose max-w-prose px-4 min-w-0 lg:px-8 py-4">
          <Page components={MDXComponents} />
        </article>

        <aside className="hidden sticky top-[50px] xl:block w-76 flex-none max-h-screen h-full p-4">
          <h3>On this page</h3>

          <TOC children={pageProps.tableOfContents} />
        </aside>
      </main>
    </>
  );
}
