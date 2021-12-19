import Vue from 'vue'
import VueRouter from 'vue-router'
import discovery from '@/views/siderBar/discovery.vue'
import playlists from '@/views/siderBar/playlists.vue'
import songs from '@/views/siderBar/songs.vue'
import mvs from '@/views/siderBar/mvs.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/discovery' },
  {
    path: '/discovery',
    name: discovery,
    component: discovery,
  },
  {
    path: '/playlists',
    name: playlists,
    component: playlists,
  },
  {
    path: '/songs',
    name: songs,
    component: songs,
  },
  {
    path: '/mvs',
    name: mvs,
    component: mvs,
  }
]

const router = new VueRouter({
  routes
})

export default router
