import Vue from 'vue'
import VueRouter from 'vue-router'
import discovery from '@/views/siderBar/discovery.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/discovery' },
  {
    path: '/discovery',
    name: discovery,
    component: discovery,
  }
]

const router = new VueRouter({
  routes
})

export default router
