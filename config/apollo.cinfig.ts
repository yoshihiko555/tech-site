/**
 * OptionalAPI時に使用していたApolloClient用設定ファイル
 * ※現在使用していない
 */
// import { ApolloLink } from 'apollo-link'
// import { HttpLink } from 'apollo-link-http'
// import { InMemoryCache } from 'apollo-cache-inmemory'

// export default () => {
//   const httpLink = new HttpLink({ uri: process.env.CTF_ENDPOINT })
//   const token = process.env.CTF_CDA_TOKEN
//   const middlewareLink = new ApolloLink((operation, forward) => {
//     operation.setContext({
//       headers: { Authorization: `Bearer ${token}` }
//     })
//     return forward(operation)
//   })
//   const link = middlewareLink.concat(httpLink)
//   return {
//     link,
//     cache: new InMemoryCache()
//   }
// }
