import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This codebase deliberately resets state in on-mount effects (game
      // init, modal-open reset, DOM-measure sync) — the pattern is the point,
      // so reporting it is pure noise here.
      "react-hooks/set-state-in-effect": "off",
      // Underscore-prefixed params/vars and `{ key: _key, ...rest }` splits
      // are the intentional way to mark values as deliberately unused.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
