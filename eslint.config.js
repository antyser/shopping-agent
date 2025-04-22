const globals = require("globals");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

module.exports = [
  {
    // Global ignores
    ignores: [
      "node_modules/",
      "dist/",
      "webpack.config.js",
      "eslint.config.js",
    ],
  },
  {
    // TypeScript files configuration
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.webextensions,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Apply recommended rules (equivalent to extends)
      ...tseslint.configs["eslint-recommended"].rules,
      ...tseslint.configs["recommended"].rules,

      // Custom rules overrides
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error", "info", "log"] }],
      // Add other custom rules here if needed
    },
  },
];
