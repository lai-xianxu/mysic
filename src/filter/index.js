// 歌曲时长处理成分秒
const DurationFilter = (data) => {
    const m = Math.floor(data / 1000 / 60)
    const s = Math.floor(data / 1000 % 60)
    return `${m}分${s}秒`
}

// 歌曲播放量过万显示万
const playNumFilter = (data) => {
    const num = data > 10000 ?  `${parseInt(data / 10000)}万` : data > 100000 ? `${parseInt(data / 100000)}万` : data > 1000000 ? `${parseInt(data / 100000)}万` : data > 10000000 ? `${parseInt(data / 1000000)}万` : data > 100000000 ? `${parseInt(data / 100000000)}万` : data
    return num
}

// 时间过滤器
const dataFormat = (data) => {
    const date = new Date(data)
    const y = date.getFullYear()
    const m = (date.getMonth() + 1 + '').padStart(2, '0')
    const d = (date.getDate() + 1 + '').padStart(2, '0')
    // const hh = (date.getHours() + 1 + '').padStart(2, '0')
    // const mm = (date.getMinutes() + 1 + '').padStart(2, '0')
    // const ss = (date.getSeconds() + 1 + '').padStart(2, '0')
    // yyyy-mm-dd hh:mm:ss
    return `${y}-${m}-${d}`
}
export {DurationFilter,playNumFilter,dataFormat}