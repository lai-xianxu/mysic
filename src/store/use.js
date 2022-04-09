// 我们需要安装vuex
// 安装后项目会有一个store的文件夹，在这个文件夹中，我们可以创建一个放变量的js文件，例如我接下来的customer.js文件
// 定义一个customerParams的变量，供全局使用
const state = {
    userInfo: localStorage.getItem('user_info') ? localStorage.getItem('user_info') : null
  }
  const getters = {
    user_info: state => {
      return state.userInfo ? JSON.parse(state.userInfo) : null
    }
  }
  const mutations = {
    USER_INFO: (state,params) => {
        state.userInfo = params
      },
  }
  export default {
    state,
    mutations,
    getters
  }