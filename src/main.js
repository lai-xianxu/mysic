import Vue from 'vue'
import App from './App.vue'
// 导入路由
import router from './router'
// 导入 Element_ui
import ElementUI from 'element-ui'
// 导入 Element-ui 样式
import 'element-ui/lib/theme-chalk/index.css'
// 插件 Element-ui
Vue.use(ElementUI)
// 导入全局初始化样式
import './assets/index.css'
// 全局注册bus
import VueBus from 'vue-bus';
Vue.use(VueBus);
// 导入vuex
import store from './store'

// 注册全局过滤器
import * as filter from './filter'
Object.keys(filter).forEach(key => {
  Vue.filter(key,filter[key])
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  // 挂载到Vue示例上
  router,
  store
}).$mount('#app')
