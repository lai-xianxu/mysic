import { request } from "@/util/request";

// 获取账号信息
export function getUserInfo(data){
    return request({
        url: '/user/account',
        method: 'get',
        params: data
    })
}

// 获取用户歌单
export function getUserPlaylist(data){
    return request({
        url: '/user/playlist',
        method: 'get',
        params: data
    })
}

