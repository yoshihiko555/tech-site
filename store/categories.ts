import {  Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Categories } from '~/generated/graphql'

@Module({ name: 'categories', stateFactory: true, namespaced: true })
export default class CategoriesModule extends VuexModule {
  /** 最新記事 */
  private _categories = new Array<Categories>();

  public get categories(): Categories[] {
    return this._categories
  }

  @Mutation
  private setCategories(categories: Categories[]) {
    this._categories = categories
  }
}
