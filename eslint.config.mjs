import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Allow unescaped ' and " in JSX text content (purely cosmetic, no runtime impact)
      "react/no-unescaped-entities": "off",
      // Allow calling async data-loader functions inside useEffect bodies
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
