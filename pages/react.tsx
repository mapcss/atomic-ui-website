import { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";
import MDXComponents from "~/components/mdx_components.tsx";
import TOC from "~/components/table_of_contents.tsx";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";

export default function Index(
  { Page, pageProps }: {
    Page?: MDXContent;
    pageProps: {
      tableOfContents?: TableOfContents;
    };
  },
): JSX.Element {
  if (!Page) return <></>;

  return (
    <>
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
      <header className="px-4 py-2 sticky top-0 backdrop-blur-md z-1 border-b bg-white/50 border-white/30">
        <div className="container mx-auto 2xl:px-34">
          <a href="/">
            <h1 className="xl:px-4 text-xl leading-relaxed">
              Atomic UI
            </h1>
          </a>
        </div>
      </header>

      <main className="container relative mx-auto flex justify-center">
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
