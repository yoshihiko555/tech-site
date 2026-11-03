import { print } from 'graphql'
import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

interface GraphQLResponse<TResult> {
  data?: TResult | null
  errors?: { message: string }[]
}

/**
 * Runs one query against the Contentful GraphQL Content API.
 * Contentful answers with data plus errors when an entry links to something
 * unpublished (the link comes back as null). That keeps the build going with a
 * warning; only a response without data fails it.
 */
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
  const reasons = response.errors?.map((error) => error.message).join('; ')
  if (!response.data) {
    throw createError({ statusCode: 502, statusMessage: `Contentful query failed: ${reasons || 'empty response'}` })
  }
  if (reasons) {
    console.warn(`[contentful] partial result: ${reasons}`)
  }
  return response.data
}
