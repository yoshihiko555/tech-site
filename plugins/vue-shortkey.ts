import Vue from 'vue'
import ShortKey from 'vue-shortkey'

// input, textarea要素のフォーカスが当たっている場合は、無効とする
Vue.use(ShortKey, { prevent: ['input', 'textarea'] })

export default ShortKey
