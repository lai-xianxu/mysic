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

// 获取歌单热门评论
export function hotComment(data){
    return request({
        url: '/comment/hot',
        method: 'get',
        params: data
    })
}

// 获取歌单所有评论
export function playlistComment(data){
    return request({
        url: '/comment/playlist',
        method: 'get',
        params: data
    })
}

// 获取MV详情
export function getMvUrl(data){
    return request({
        url: '/mv/url',
        method: 'get',
        params: data
    })
}

// 获取相关Mv
export function getMvSimi(data){
    return request({
        url: '/simi/mv',
        method: 'get',
        params: data
    })
}

// 获取Mv信息
export function getMvDetail(data){
    return request({
        url: 'mv/detail',
        method: 'get',
        params: data
    })
}

// 获取歌手部分信息
export function getArtistsInfo(data){
    return request({
        url: '/artists',
        method: 'get',
        params: data
    })
}

// 获取Mv评论
export function getMvComment(data){
    return request({
        url: '/comment/mv',
        method: 'get',
        params: data
    })
}

// 获取歌曲详情
export function getSongDetail(data){
    return request({
        url: '/song/detail',
        method: 'get',
        params: data
    })
}

// 获取歌曲歌词
export function getlyric(data){
    return request({
        url: '/lyric',
        method: 'get',
        params: data
    })
}

// 获取歌曲评论
export function getCommitMusic(data){
    return request({
        url: '/comment/music',
        method: 'get',
        params: data
    })
}

// 获取相似音乐
export function getSimiSong(data){
    return request({
        url: '/simi/song',
        method: 'get',
        params: data
    })
}

// 喜欢音乐
export function setLike(data) {
    return request({
        url: `/like?timestamp=${Date.now()}`,
        method: 'post',
        data
    })
}