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

export default <Config> {
  extractor: [simpleExtractor, bracketExtractor],
  preset: [
    presetTw({
      darkMode: "class",
    }),
    presetTypography({
      css: {
        pre: {
          padding: false,
          margin: false,
          borderRadius: false,
        },
        code: {
          background: false,
          color: false,
        },
        ":not(pre) > code::before, :not(pre) > code::after": false,
        "tr:nth-child(2n)": false,
      },
    }),
    presetSVG({
      mdi: iconifyJSON(mdi),
    }, {
      declaration: {
        display: "inline-block",
        verticalAlign: "middle",
      },
    }),
  ],
  css: [preflightCSS, {
    "*": {
      scrollPaddingTop: "50px",
    },
  }],
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
