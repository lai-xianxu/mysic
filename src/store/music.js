// 我们需要安装vuex
// 安装后项目会有一个store的文件夹，在这个文件夹中，我们可以创建一个放变量的js文件，例如我接下来的customer.js文件
// 定义一个customerParams的变量，供全局使用
const state = {
  curMusic: localStorage.getItem('curMusic') || '',
  musicList: localStorage.getItem('musicList') || '',
  curIcon: localStorage.getItem('curIcon') || 'order'
}
const getters = {
  // 任务列表
  musicList: state => {
    return (state.musicList ? JSON.parse(state.musicList) : [])
  },
  // 当前音乐
  curMusic: state => {
    return (state.curMusic ? JSON.parse(state.curMusic) : {})
  }
}
const mutations = {
  // 将存入的值赋给state的curMusic
  CUR_MUSIC: (state,params) => {
    state.curMusic = JSON.stringify(params)
    // localStorage.setItem('musicList', params)
  },

  MUSIC_LIST: (state,params) => {
    state.musicList = JSON.stringify(params)
  },

  CUR_ICON: (state,params) => {
    state.curIcon = params
  },
}
export default {
  state,
  mutations,
  getters
}