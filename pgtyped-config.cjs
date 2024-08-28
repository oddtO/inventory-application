/* eslint-disable */

const config = {
  transforms: [
    {
      mode: "sql",
      include: "**/*.sql",
      emitTemplate: "{{dir}}/{{name}}.queries.ts",
    },
    {
      mode: "ts",
      include: "**/*.ts",
      emitTemplate: "{{dir}}/{{name}}.types.ts",
    },
  ],
  srcDir: "./ts/db/",
  dbUrl: process.env.PGURI,
};

module.exports = config;
