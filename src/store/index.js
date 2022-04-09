// 在store文件夹的index.js引用
import Vue from 'vue'
import Vuex from 'vuex'
import music from './music'
import use from './use'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    music,
    use
  },
})
export default store