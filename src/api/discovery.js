import { request } from "@/util/request";

// 获取首页轮播图数据
export function getBanner(data){
    return request({
        url: '/banner',
        method: 'post',
        data
    })
}

// 获取推荐歌单
export function personalized(data){
    return request({
        url: '/personalized',
        method: 'post',
        data
    })
}

// 获取最新音乐
export function newsong(data){
    return request({
        url: '/personalized/newsong',
        method: 'post',
        data
    })
}

// 获取音乐链接
export function getSongUrl(data){
    return request({
        url: '/song/url',
        method: 'get',
        params:data
    })
}

// 获取音乐mv
export function getSongMV(data){
    return request({
        url: '/personalized/mv',
        method: 'post',
        data
    })
}

// 获取歌单列表
export function getPlaylist(data){
    return request({
        url: '/top/playlist',
        method: 'get',
        params:data
    })
}

// 获取推荐歌单
export function getHighquality(data){
    return request({
        url: '/top/playlist/highquality',
        method: 'post',
        data
    })
}

// 获取最新音乐
export function getNewSong(data){
    return request({
        url: '/top/song',
        method: 'post',
        data
    })
}