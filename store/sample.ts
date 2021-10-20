/**
 * vuex-module-decoratorsの検証ファイル
 */
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export interface Sample {
  id: number
  name: string
}

/**
 * @Moduleのnameプロパティは、storeディレクトリ以下のファイル名と一致させる必要がある
 * 例えば、store/modules/hoge.tsであれば、name: modules/hogeとなる
 */
@Module({ name: 'sample', stateFactory: true, namespaced: true })
export default class SampleState extends VuexModule {
  private _samples: Sample[] = []

  /** getter */
  get samples(): Sample[] {
    console.log('samples getter')
    return this._samples
  }

  get sampleNames(): string[] {
    console.log('names getter')
    return this._samples.map(i => i.name)
  }

  @Mutation
  private _add(sample: Sample): void {
    console.log('mutation')
    this._samples.push(sample)
  }

  @Action({ rawError: true })
  add(sample: Sample ) {
    console.log('action')
    this._add(sample)
  }

}
