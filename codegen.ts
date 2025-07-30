import "dotenv/config";
import type { CodegenConfig } from "@graphql-codegen/cli";

// console.log(process.env.NHOST_GRAPHQL_URL, process.env.HASURA_ADMIN_SECRET);
const config: CodegenConfig = {
  schema: [
    {
      [process.env.NHOST_GRAPHQL_URL!]: {
        headers: {
          "x-hasura-admin-secret": process.env.HASURA_ADMIN_SECRET!,
        },
      },
    },
  ],
  documents: ["src/graphql/**/*.graphql"],
  generates: {
    "./src/gql/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        skipTypename: false,
        strictScalars: true,
        scalars: {
          uuid: "string",
          numeric: "number",
          timestamptz: "string",
          jsonb: "unknown",
          bigint: "string",
          bytea: "string",
          citext: "string",
          float8: "number",
        },
      },
      // preset: "client",
    },
  },
};

export default config;
