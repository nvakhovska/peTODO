import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import jestPlugin from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
      ecmaVersion: 2021,
      globals: {
        browser: true,
        node: true,
        process: true,
        console: true,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      eqeqeq: "error",
      "no-debugger": "warn",
      "prefer-destructuring": ["error", { object: true, array: false }],
    },
  },
  {
    files: ["**/*.test.{js,ts,jsx,tsx}", "test/**/*.{js,ts}"],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...jestPlugin.environments.globals.globals,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
    },
  },
];
