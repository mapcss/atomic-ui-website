import {
  bracketExtractor,
  Config,
  simpleExtractor,
} from "https://deno.land/x/mapcss@1.0.0-beta.58/core/mod.ts";
import {
  preflightCSS,
  presetTw,
} from "https://deno.land/x/mapcss@1.0.0-beta.58/preset_tw/mod.ts";
import {
  presetTypography,
} from "https://deno.land/x/mapcss@1.0.0-beta.58/preset_typography/mod.ts";
import autoprefixer from "https://esm.sh/autoprefixer";
import {
  iconifyJSON,
  presetSVG,
} from "https://deno.land/x/mapcss@1.0.0-beta.58/preset_svg/mod.ts";
import mdi from "https://esm.sh/@iconify-json/mdi/icons.json" assert {
  type: "json",
};
import charm from "https://esm.sh/@iconify-json/charm/icons.json" assert {
  type: "json",
};

export default <Config> {
  extractor: [simpleExtractor, bracketExtractor],
  preset: [
    presetTw({
      darkMode: "class",
    }),
    presetTypography({
      css: {
        h2: {
          lineHeight: false,
        },
        pre: {
          padding: false,
          margin: false,
          borderRadius: false,
          overflowX: false,
        },
        code: {
          background: false,
          color: false,
        },
        ":not(pre) > code::before, :not(pre) > code::after": false,
        table: {
          margin: false,
        },
        "tr:nth-child(2n)": false,
        ol: {
          paddingLeft: false,
        },
      },
    }),
    presetSVG({
      mdi: iconifyJSON(mdi),
      charm: iconifyJSON(charm),
    }, {
      declaration: {
        display: "inline-block",
        verticalAlign: "middle",
      },
    }),
  ],
  css: [preflightCSS],
  postcssPlugin: [autoprefixer],
  cssMap: {
    max: {
      w: {
        "8xl": {
          maxWidth: "90rem",
        },
      },
    },
  },
};
