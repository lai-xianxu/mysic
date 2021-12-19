import { request } from "@/util/request";

// 获取歌单详情
export function detail(data){
    return request({
        url: '/playlist/detail',
        method: 'get',
        params: data
    })
}

// 获取歌单列表所有歌曲
export function playlistAll(data){
    return request({
        url: '/song/detail',
        method: 'get',
        params: data
    })
}