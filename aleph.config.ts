import { Config } from "aleph/types";
import {
  mdx,
  remarkFrontmatterProps,
  remarkTocProps,
} from "https://deno.land/x/aleph_plugin_mdx@v1.3.0-beta.1/mod.ts";
import remarkEmoji from "https://esm.sh/remark-emoji";
import patchImport from "https://crux.land/7K9MjV";
import injectReact from "https://crux.land/6m9ZEy";
import mapcss from "~/plugins/mapcss.ts";
import json from "./import_map.json" assert { type: "json" };
import remarkFrontmatter from "https://cdn.skypack.dev/remark-frontmatter";
import { remarkMdxFrontmatter } from "https://esm.sh/remark-mdx-frontmatter";
import rehypeSlug from "https://esm.sh/rehype-slug@5";
import rehypeHighlight from "https://esm.sh/rehype-highlight@5";
import postcssPluginMapcss from "https://deno.land/x/postcss_mapcss@1.0.0-beta.2/mod.ts";
import remarkGfm from "https://esm.sh/remark-gfm@3";

export default <Config> {
  plugins: [
    mapcss({ ext: ["tsx", "mdx"] }),
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        // deno-lint-ignore no-explicit-any
        remarkMdxFrontmatter as any,
        remarkFrontmatterProps,
        remarkTocProps,
        remarkGfm,
        remarkEmoji,
      ],
      rehypePlugins: [rehypeSlug, rehypeHighlight],
      rewritePagePath: (path) => path.replaceAll("_", "-"),
    }),
    patchImport(json.imports["react"]),
    injectReact(),
  ],
  css: {
    postcss: {
      plugins: [
        postcssPluginMapcss({
          injectCSS: false,
        }),
      ],
    },
  },
};
