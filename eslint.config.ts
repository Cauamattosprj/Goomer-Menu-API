import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig } from "eslint/config";


const config = defineConfig([
  {
    files: ["**/*.{ts,tsx,js}"],
    ignores: ["dist", "node_modules"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",

      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: false },
      ],

      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-unsafe-member-access": "error",

      "no-console": "warn",
      "no-unused-vars": "warn",
    },
  },
]);

export default config;
