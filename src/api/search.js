import { request } from "@/util/request";

// 搜索
export function search(data){
    return request({
        url: '/search',
        method: 'get',
        params: data
    })
}