export default {
  env: {
    browser: true,
    node: true,
    es2021: true,
    process: true,
    console: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": "off",
    "no-debugger": "warn",
    "react/react-in-jsx-scope": "off",
    "prefer-destructuring": ["error", { object: true, array: false }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
