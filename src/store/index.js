// 在store文件夹的index.js引用
import Vue from 'vue'
import Vuex from 'vuex'
import music from './music'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    music
  },
})
export default store