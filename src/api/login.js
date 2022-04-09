import { request } from "@/util/request";

// 手机登录
export function LoginPhone(data) {
    return request({
        url: `/login/cellphone?timestamp=${Date.now()}`,
        method: 'post',
        data
    })
}

// 获取验证码
export function sentCaptcha(data) {
    return request({
        url: `/captcha/sent?timestamp=${Date.now()}`,
        method: 'post',
        data
    })
}

// 验证验证码
export function captchaVerify(data) {
    return request({
        url: `/captcha/verify?timestamp=${Date.now()}`,
        method: 'post',
        data
    })
}

// 二维码key生成接口
export function loginQrKey(data) {
    return request({
        url: `/login/qr/key?timestamp=${Date.now()}`,
        method: 'post',
        data
    })
}

// 二维码生成接口
export function loginQrCreat(data) {
    return request({
        url: `/login/qr/create?timestamp=${Date.now()}`,
        method: 'post',
        data
    })
}

// 二维码生成接口
export function loginQrCheck(data) {
    return request({
        url: `/login/qr/check?timestamp=${Date.now()}`,
        method: 'post',
        data
    })
}

// 获取登录状态
export function loginStatus(data) {
    return request({
        url: `/login/status?timestamp=${Date.now()}`,
        method: 'post',
        data
    })
}

// 退出登录
export function logout(data) {
    return request({
        url: `/logout?timestamp=${Date.now()}`,
        method: 'post',
        data
    })
}