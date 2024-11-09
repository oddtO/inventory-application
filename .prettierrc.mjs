/** @type {import('prettier').Config} */
const prettierConfig = {
  plugins: [
    "prettier-plugin-embed",
    "prettier-plugin-sql",
    "prettier-plugin-ejs",
  ],
};

/** @type {import('prettier-plugin-embed').PrettierPluginEmbedOptions} */
const prettierPluginEmbedConfig = {
  embeddedSqlTags: ["sql"],
};

/** @type {import('prettier-plugin-sql').SqlBaseOptions} */
const prettierPluginSqlConfig = {
  language: "postgresql",
  keywordCase: "upper",
};

export default {
  ...prettierConfig,
  ...prettierPluginEmbedConfig,
  ...prettierPluginSqlConfig,
  bracketSameLine: true, // or false
  htmlWhitespaceSensitivity: "ignore",
};
