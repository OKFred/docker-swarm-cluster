import vue from "eslint-plugin-vue";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import parser from "vue-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/dist",
      "**/node_modules",
      "**/public",
      "**/.husky",
      "**/.vscode",
      "**/.idea",
      "**/*.sh",
      "**/*.md",
      "**/openapi.d.ts",
      "src/assets",
      "**/.eslintrc.cjs",
      "**/.prettierrc.cjs",
      "**/.stylelintrc.cjs",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ),
  {
    plugins: {
      vue,
      "@typescript-eslint": typescriptEslint,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        DialogOption: "readonly",
        OptionType: "readonly",
      },

      parser: parser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
    },

    rules: {
      "vue/multi-word-component-names": "off",
      "no-unused-vars": [
        "warn",
        {
          ignoreRestSiblings: true,
          caughtErrors: "none",
          destructuredArrayIgnorePattern: "error",
        },
      ],
      "prettier/prettier": [
        "error",
        {
          endOfLine: "crlf",
        },
      ],
    },
  },
];
