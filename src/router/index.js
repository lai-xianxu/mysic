import Vue from 'vue'
import VueRouter from 'vue-router'
import discovery from '@/views/siderBar/discovery.vue'
import playlists from '@/views/siderBar/playlists.vue'
import songs from '@/views/siderBar/songs.vue'
import mvs from '@/views/siderBar/mvs.vue'
import mys from '@/views/siderBar/mys.vue'
import result from '@/views/search/result.vue'
import playsDetail from '@/views/songsDetail/playsDetail.vue'
import mvDetail from '@/views/songsDetail/mvDetail.vue'
import detail from '@/views/songsDetail/detail.vue'

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
  },
  {
    path: '/mys',
    name: mys,
    component: mys,
  },
  {
    path: '/result',
    name: result,
    component: result,
  },
  {
    path: '/playsDetail',
    name: playsDetail,
    component: playsDetail,
  },
  {
    path: '/mvDetail',
    name: mvDetail,
    component: mvDetail,
  },
  {
    path: '/detail',
    name: detail,
    component: detail,
  }
]

const router = new VueRouter({
  routes
})

export default router
