import { FC } from "react";
import { SSRProvider } from "@atomic_ui_react/mod.ts";
import "~/style/map.css";
import "~/style/global.css";

export default function App(
  { Page, pageProps }: { Page: FC; pageProps: Record<string, unknown> },
) {
  return (
    <SSRProvider>
      <head>
        <meta name="viewport" content="width=device-width" />
      </head>
      <Page {...pageProps} />
    </SSRProvider>
  );
}
