import {  Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Tags } from '~/generated/graphql'

@Module({ name: 'tags', stateFactory: true, namespaced: true })
export default class TagsModule extends VuexModule {
  /** 最新記事 */
  private _tags = new Array<Tags>();

  public get tags(): Tags[] {
    return this._tags
  }

  @Mutation
  private setTags(tags: Tags[]) {
    this._tags = tags
  }
}
