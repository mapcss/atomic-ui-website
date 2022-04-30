import { FC } from "react";
import { SSRProvider } from "@atomic_ui_react/mod.ts";
import "~/style/map.css";
import "~/style/global.css";

export default function App(
  { Page, pageProps }: { Page: FC; pageProps: Record<string, unknown> },
) {
  return (
    <>
      <head>
        <meta name="viewport" content="width=device-width" />
        <script>
          {`
        const theme = window.localStorage.getItem("theme");
        const media = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (
          theme === "dark" ||
          (theme === null &&
            media)
        ) {
          document.documentElement.classList.add("dark");
          localStorage.setItem('theme', 'dark')
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem('theme', 'light')
        }`}
        </script>
      </head>
      <SSRProvider>
        <Page {...pageProps} />
      </SSRProvider>
    </>
  );
}
