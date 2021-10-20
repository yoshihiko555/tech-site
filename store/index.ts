/**
 * vuex-module-decoratorsを使用したやり方
 */
import { Store, ActionTree, ActionContext } from 'vuex'
import { initialiseStores } from '~/utils/store-accessor'
import { AppInitDocument, ArticlesCollection, CategoriesCollection, TagsCollection } from '~/generated/graphql'

export const state = () => ({})
export type RootState = ReturnType<typeof state>
const initializer = (store: Store<any>) => initialiseStores(store)

/**
 * nuxtServerInitは、プライマリモジュールのみで実行可能なので
 * 下記Actionsを用意して実行させる
 */
export const actions: ActionTree<RootState, RootState> = {

  // 下記の型定義を行うと、context.appにアクセスすると怒られてしまうので定義しない（これも調査したい）
  // nuxtServerInit: async (_, context: ActionContext<RootState, RootState>) => {

  async nuxtServerInit (store, context) {
  // 下記のやり方ではuseAppInitQuery内でApollo-Clientを使用しようとした時にエラーになっているっぽく動作しない
    // const response = await context.app.apolloProvider.defaultClient.query(useAppInitQuery({ limit: 5 }))
    // console.log('ng response', response)

    // 下記のやり方ならContext内に存在するApollo-Clientを使用してクエリーの実行が可能
    // 但し、TypeScriptの恩恵を受けられていないので、そこは要調査
    type Result = {
      data: {
        articlesCollection: ArticlesCollection
        categoriesCollection: CategoriesCollection
        tagsCollection: TagsCollection
      }
    }
    const res = await context.app.apolloProvider.defaultClient.query({
      query: AppInitDocument,
      variables: { limit: 5 }
    }) as Result

    // 各モジュールにコミット
    store.commit('articles/setRecentArticles', res.data.articlesCollection.items)
    store.commit('categories/setCategories', res.data.categoriesCollection.items)
    store.commit('tags/setTags', res.data.tagsCollection.items)
  }
}
export const plugins = [initializer]
export * from '~/utils/store-accessor'


/**
 * 以下公式Documentの基本的なタイピングのやり方
 */
// import { GetterTree, ActionTree, MutationTree } from 'vuex'
// import { Articles } from 'generated/graphql'
// export const state = () => ({
//   recentArticles: new Array<Articles>(),
//   hoge: 0 as number
// })

// export type RootState = ReturnType<typeof state>

// export const getters: GetterTree<RootState, RootState> = {
//   recentArticles: state => state.recentArticles,
//   hoge: state => state.hoge,
// }

// export const mutations: MutationTree<RootState> = {
//   setRecentArticles: (state, payload: Articles[]) => state.recentArticles = payload,
//   setHoge: (state, payload: number) => state.hoge = payload,
// }

// export const actions: ActionTree<RootState, RootState> = {
//   async nuxtServerInit ({ commit, dispatch }) {
//     console.log('nuxtServerInit State!')
//     commit('setHoge', 1)
//   }
// }
