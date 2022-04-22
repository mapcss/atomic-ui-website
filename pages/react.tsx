import { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";
import MDXComponents from "~/components/mdx_components.tsx";

export default function Index({ Page }: { Page?: MDXContent }): JSX.Element {
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
      <header className="p-2 sticky top-0 bg-white z-1 border-b border-gray-200">
        <div className="container mx-auto 2xl:px-34">
          <a href="/">
            <h1 className="xl:px-4 text-xl leading-relaxed">
              Atomic UI
            </h1>
          </a>
        </div>
      </header>

      <main className="container relative mx-auto flex justify-center">
        <aside className="hidden sticky top-[50px] md:block w-76 min-h-full flex-none p-4">
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

        <article className="prose max-w-prose px-2 lg:px-8 py-4 overflow-x-scroll">
          <Page
            components={MDXComponents}
          />
        </article>

        <aside className="hidden xl:block w-76 flex-none h-100 p-4">
          On this page
        </aside>
      </main>
    </>
  );
}
