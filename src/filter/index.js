const DurationFilter = (data) => {
    const m = Math.floor(data / 1000 / 60)
    const s = Math.floor(data / 1000 % 60)
    return `${m}分${s}秒`
}

export {DurationFilter}