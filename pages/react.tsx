import { memo, useMemo, useRef, useState } from "react";
import { dynamic, useRouter } from "aleph/react";
import { MDXContent } from "https://esm.sh/@types/mdx/types.d.ts";
import MDXComponents from "~/components/mdx_components.tsx";
import {
  Breadcrumb,
  DisclosureProvider,
  filterTruthy,
  useBoolean,
  WithDisclosureContent,
  WithDisclosureControl,
} from "@atomic_ui_react/mod.ts";
import _Header from "~/components/header.tsx";
import type { TableOfContents } from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";
import _TOCContent from "~/components/toc_content.tsx";
import NavigationDrawerContext from "~/contexts/react/navigation_drawer.ts";
import ArticleRefContext from "~/contexts/react/article_ref.ts";
import Toolbar from "~/components/toolbar.ts";
import { clsx, SchemaOrg } from "~/deps.ts";
import useIntersection from "~/hooks/use_intersection.ts";
import { capitalize } from "~/util.ts";

const BASE_URL = "https://atomic-ui.miyauchi.dev/";

const Head = memo(_Head);
const TOCContent = memo(_TOCContent);
const Header = memo(_Header);

const schema = (name: string): SchemaOrg => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "React",
    "item": {
      "@type": "Thing",
      "@id": new URL("react", BASE_URL).toString(),
    },
  }, {
    "@type": "ListItem",
    "position": 2,
    name,
  }],
});

const Portal = dynamic(() => import("~/components/portal.tsx"));
const HashLink = dynamic(() => import("~/components/hash_link.tsx"));

type NavLink = {
  name: string;
  path: string;
};
const navLinks: NavLink[] = [
  { name: "Breadcrumb", path: "/react/breadcrumb" },
  {
    name: "Transition",
    path: "/react/transition",
  },
  {
    name: "Switch",
    path: "/react/switch",
  },
  {
    name: "Disclosure",
    path: "/react/disclosure",
  },
];

type HeadProps = {
  title: string;
  description: string;
  publishedAt?: string;
  modifiedAt?: string;
};

function _Head(
  { title, description, publishedAt }: Readonly<HeadProps>,
): JSX.Element {
  const { routePath } = useRouter();
  const path = useMemo<string>(() => new URL(routePath, BASE_URL).toString(), [
    routePath,
  ]);
  const schemaStr = useMemo<string>(
    () => JSON.stringify(schema(path)),
    [
      schema,
      path,
    ],
  );
  const t = useMemo<string>(() => `${capitalize(title)} | Atomic UI`, [title]);

  return (
    <head>
      <title>{t}</title>
      <meta property="og:title" content={t} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={path} />
      <meta property="article:author" content="TomokiMiyauci" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:creator" content="@tomoki_miyauci" />
      <meta name="twitter:site" content="@tomoki_miyauci" />
      {publishedAt &&
        <meta property="article:published_time" content={publishedAt} />}

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.4.0/styles/github-dark.min.css"
      />
      <link
        rel="stylesheet"
        href="~/style/highlight.css"
      />
      <script type="application/ld+json">
        {schemaStr}
      </script>
    </head>
  );
}

function Main(): JSX.Element {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="max-w-7xl w-full grid place-content-center flex-1 mx-auto h-full">
        <nav>
          <ul>
            <li>
              <a
                className="border p-1 rounded-md inline-block"
                href="transition"
              >
                <h2 className="text-xl">Transition</h2>
              </a>
            </li>
          </ul>
        </nav>
      </main>
    </div>
  );
}

type PageProps = {
  meta?: {
    description: string;
    publishedAt: string;
  };
  tableOfContents?: TableOfContents;
};

export type Props = {
  Page: MDXContent;
  pageProps: PageProps;
};

export default function Page(
  { Page, pageProps }: Readonly<Partial<Props>>,
): JSX.Element {
  if (!Page) {
    return <Main />;
  }
  const title = pageProps?.tableOfContents?.items?.[0].title;
  const description = pageProps?.meta?.description;
  const publishedAt = pageProps?.meta?.publishedAt;
  if (!title) {
    throw Error("title is not exist");
  }
  if (!description) {
    throw Error("description is not exist");
  }

  const [isShow, { on, off, toggle }] = useBoolean();
  const ref = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);

  const [activeAttr, setActiveAttr] = useState<
    Pick<Element, "id" | "textContent"> | undefined
  >();

  useIntersection({
    target: () => {
      if (!articleRef.current) return;
      const el = articleRef.current.querySelectorAll(
        "section > h1, section > h2, section > h3, section > h4",
      );
      const sections = filterTruthy(Array.from(el).map((a) => a.parentElement));
      return sections;
    },
    instance: () => {
      return new IntersectionObserver((entry) => {
        entry.forEach(({ target, isIntersecting }) => {
          const children = target.firstElementChild;
          if (!children) return;
          const id = `#${children.id}`;
          if (isIntersecting) {
            setActiveAttr({ id, textContent: children.textContent });
          }
        });
      }, { root: null, rootMargin: "-50% 0px", threshold: 0 });
    },
  }, [Page]);

  return (
    <NavigationDrawerContext.Provider value={[isShow, { on, off, toggle }]}>
      <ArticleRefContext.Provider value={articleRef}>
        <Head
          title={title}
          description={description}
          publishedAt={publishedAt}
        />

        <Portal>
          {isShow && (
            <div className="fixed z-1 inset-0">
              <head>
                <style>
                  {`
            html{
              overflow: hidden
            }`}
                </style>
              </head>

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
            </div>
          )}
        </Portal>

        <Header
          className={clsx(
            "h-[50px] sticky top-0 z-2 flex justify-center px-5 sm:px-12 lg:px-4 xl:px-0 border-b bg-white dark:bg-dark-900 border-white/30 dark:border-dark-200",
          )}
        />
        <div className="max-w-7xl px-5 sm:px-12 lg:px-4 xl:px-0 mx-auto grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] justify-center grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)]">
          <div className="order-2 md:py-8">
            <aside className="sticky z-1 whitespace-nowrap overflow-x-scroll -mx-5 sm:mx-0 px-5 sm:px-0 top-[50px] border-2 border-white dark:border-dark-900 bg-white dark:bg-dark-900">
              <Breadcrumb
                disabledAriaCurrent
                separator={<span className="i-mdi-chevron-right" />}
                components={{
                  ol: (props) => (
                    <ol {...props} className="space-x-2 flex items-center" />
                  ),
                  li: (props) => (
                    <li
                      {...props}
                      className="space-x-1 inline-flex items-center"
                    />
                  ),
                }}
              >
                <a href="/react">Home</a>
                <a aria-current="page" className="capitalize">{title}</a>

                {activeAttr &&
                  (
                    <span className="inline-flex items-center text-amber-500">
                      <span className="i-mdi-music-accidental-sharp" />
                      <HashLink href={activeAttr?.id}>
                        {activeAttr?.textContent}
                      </HashLink>
                    </span>
                  )}
              </Breadcrumb>
            </aside>

            <DisclosureProvider>
              <WithDisclosureControl>
                {(attrs, { isOpen }) => (
                  <button
                    {...attrs}
                    className="flex w-full justify-center items-center lg:hidden space-x-2 rounded p-1 dark:border-dark-200 my-4"
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
              </WithDisclosureControl>

              <WithDisclosureContent>
                {(props, { isOpen }) => (
                  isOpen && (
                    <nav {...props} className="lg:hidden my-4">
                      <TOCContent children={pageProps?.tableOfContents} />
                    </nav>
                  )
                )}
              </WithDisclosureContent>
            </DisclosureProvider>

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
              <h1 className="font-bold">Component</h1>
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
            <h1 className="hidden md:block font-bold">
              On this page
            </h1>

            <nav>
              <TOCContent children={pageProps?.tableOfContents} />
            </nav>
          </aside>
        </div>
      </ArticleRefContext.Provider>
    </NavigationDrawerContext.Provider>
  );
}
