import type { CodegenConfig } from '@graphql-codegen/cli'

/**
 * Types for the Contentful GraphQL queries in graphql/.
 * The schema is read from the committed introspection file, so codegen runs
 * without Contentful credentials. Refresh that file when the content model changes.
 */
const config: CodegenConfig = {
  overwrite: true,
  schema: './generated/graphql.schema.json',
  documents: ['./graphql/**/*.gql'],
  generates: {
    './generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
      config: {
        avoidOptionals: false,
        skipTypename: true,
        useTypeImports: true,
        // Contentful custom scalars
        scalars: {
          DateTime: 'string',
          Dimension: 'number',
          HexColor: 'string',
          JSON: 'unknown',
          Quality: 'number',
        },
      },
    },
  },
}

export default config
