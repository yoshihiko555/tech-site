import {  Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Articles } from '~/generated/graphql'

@Module({ name: 'articles', stateFactory: true, namespaced: true })
export default class ArticlesModule extends VuexModule {
  /** 最新記事 */
  private _recentArticles = new Array<Articles>();

  public get recentArticles(): Articles[] {
    return this._recentArticles
  }

  @Mutation
  private setRecentArticles(articles: Articles[]) {
    this._recentArticles = articles
  }
}
