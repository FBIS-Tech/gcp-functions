module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  // parserOptions: {
  //   project: ["tsconfig.json", "tsconfig.dev.json"],
  //   sourceType: "module"
  // },
  ignorePatterns: [
    "/lib/**/*" // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import"
  ],
  rules: {
    "quotes": ["error", "double"],
    "semi": ["error", "never"],
    "indent": "off",
    "comma-dangle": ["error", "never"],
    "max-len": ["error", { "code": 100, "tabWidth": 4 }],
    "object-curly-spacing": ["error", "always"],
    "no-multiple-empty-lines": [2, { "max": 3, "maxEOF": 1 }]
  }
}
