import { request } from "@/util/request";

// 获取首页轮播图数据
export function getBanner(data){
    return request({
        url: '/banner',
        method: 'post',
        data
    })
}