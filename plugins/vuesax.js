import Vue from 'vue'
import Vuesax from 'vuesax'

Vue.use(Vuesax)

// SSRでは、下記の書き方だと反映されない模様
// また公式でも今の所対応の予定はなさそうなので、SCSSでテーマの設定をする
// Vue.use(Vuesax, {
//   server: true,
//   theme: {
//     colors: {
//       primary: #546E7A,
//     }
//   }
// })
