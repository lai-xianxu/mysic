import { request } from "@/util/request";

// 搜索
export function search(data) {
    return request({
        url: '/search',
        method: 'get',
        params: data
    })
}
// 模糊搜索
export function searchSuggest(data) {
    return request({
        url: '/search/suggest',
        method: 'get',
        params: data
    })
}
// 热门搜索
export function searchHot(data) {
    return request({
        url: '/search/hot/detail',
        method: 'get',
        params: data
    })
}