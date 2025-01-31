// eslint.config.js (Flat Config for ESLint 9+)
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  js.configs.recommended, // Enable ESLint recommended rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"], // Apply ESLint to these file types
    languageOptions: {
      parser: tsparser, // Use TypeScript parser
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint, // Enable TypeScript linting
    },
    rules: {
      // Custom rules
      "no-unused-vars": "warn",
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      eqeqeq: "error",
    },
  },
];
