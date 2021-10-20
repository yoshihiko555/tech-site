import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import SampleModule from '~/store/sample'
import ArticlesModule from '~/store/articles'
import CategoriesModule from '~/store/categories'
import TagsModule from '~/store/tags'

let sampleModule: SampleModule
let articlesModule: ArticlesModule
let categoriesModule: CategoriesModule
let tagsModule: TagsModule

const initialiseStores = (store: Store<any>): void => {
  sampleModule = getModule(SampleModule, store)
  articlesModule = getModule(ArticlesModule, store)
  categoriesModule = getModule(CategoriesModule, store)
  tagsModule = getModule(TagsModule, store)
}

export { initialiseStores, sampleModule, articlesModule, categoriesModule, tagsModule }
