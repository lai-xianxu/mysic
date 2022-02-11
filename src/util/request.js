import axios from 'axios'

export function request(config) {
    const instance = axios.create({
        // 设置请求头
        baseURL: 'http://localhost:3000',
        
        // 解决非国内服务器方法
        // headers: {
        //    'X-Real-IP':'211.161.244.70'
        // },

        // 解决跨域问题
        withCredentials: true, //关键
        // 设置请求时间
        timeout: 3000
    })

    // 请求拦截
    instance.interceptors.request.use(config => {
        // 需要认证的接口在这里统一设置，例：登录

        // 直接放行
        return config
    },error => {
        console.log(error,'接口请求错误');
    })

    // 响应拦截
    instance.interceptors.response.use(res => {
        return res.data
    },error => {
        // 如果有需要授权才可以访问的接口，统一在这里去login授权

        // 如果有错误，这里去设置处理，显示错误信息
        console.log(error,'接口响应错误');
    })

    return instance(config)
}