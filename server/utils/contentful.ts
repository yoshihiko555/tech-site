import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

interface GraphQLResponse<TResult> {
  data?: TResult
  errors?: { message: string }[]
}

/** Runs one query against the Contentful GraphQL Content API. */
export async function queryContentful<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables,
): Promise<TResult> {
  const { ctfEndpoint, ctfCdaToken } = useRuntimeConfig()
  if (!ctfEndpoint || !ctfCdaToken) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Contentful is not configured: set CTF_ENDPOINT and CTF_CDA_TOKEN',
    })
  }
  const response = await $fetch<GraphQLResponse<TResult>>(ctfEndpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ctfCdaToken}` },
    body: { query: print(document), variables },
  })
  if (response.errors?.length || !response.data) {
    const reason = response.errors?.map((error) => error.message).join('; ') || 'empty response'
    throw createError({ statusCode: 502, statusMessage: `Contentful query failed: ${reason}` })
  }
  return response.data
}
