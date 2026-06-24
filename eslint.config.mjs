export default [
  {
    files: ["*.js", "tests/**/*.js", "tools/**/*.mjs"],
    ignores: ["node_modules/**", "api/node_modules/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        URL: "readonly",
        FormData: "readonly",
        FileReader: "readonly",
        Blob: "readonly",
        fetch: "readonly",
        sessionStorage: "readonly",
        localStorage: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly",
      },
    },
    rules: {},
  },
  {
    files: ["tools/**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
    rules: {},
  },
];
