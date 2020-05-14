const log = console.log.bind(console)

const e = function (selector) {
    let element = document.querySelector(selector)
    if (element === null) {
        let s = `选择器 ${selector} 写错了`
        alert(s)
        return null
    } else {
        return element
    }
}

const es = function (selector) {
    let elements = document.querySelectorAll(selector)
    if (elements.length === 0) {
        let s = `选择器 ${selector} 写错了`
        alert(s)
        return []
    } else {
        return elements
    }
}



const config = {
    random: false,
    circle: false,
    renderId: null,
}

const playList = () => {
    let lib = [
        {
            src: './audios/fall-in-love.mp3',
            name: '徳永英明 - 恋におちて-Fall in Love',
        },

        {
            src: './audios/creep.mp3',
            name: 'Scott Bradlee’s Postmodern Jukebox - Creep',
        },
        {
            src: './audios/danger-in-loving-you.mp3',
            name: 'Halie Loren - Danger in Loving You (Live)',
        },
    ]
    return lib
}

const resetPlayButton = (a) => {
    let button = e('#id-button-play')
    let b = button.querySelector('.fa-pause')
    if (b) {
        b.className = 'fa fa-play'
    }
}

const resetProgress = () => {
    renderPlayer(0, 100)
}

const switchSong = (audio, n) => {
    let info = e('.info__song')
    let lib = playList()

    info.innerText = lib[n].name
    log(lib[n], lib, info.innerText)
    audio.src = lib[n].src
    audio.dataset.index = n
}


const playBackward = (a) => {
    resetPlayButton(a)
    resetProgress()
    log(a.dataset)
    let i = a.dataset.index
    let lib = playList()
    let n = ((i - 1) + lib.length) % lib.length
    if (config.random) {
        n = choice(lib)
    }
    log(lib[n], n)
    switchSong(a, n)
    playSong()
    log('back')
}

const playForward = (a) => {
    resetPlayButton(a)
    resetProgress()
    log(a.dataset)
    let i = a.dataset.index
    let lib = playList()
    let n = ((i + 1) + lib.length) % lib.length
    if (config.random) {
        n = choice(lib)
    }
    log(lib[n], n)
    switchSong(a, n)
    playSong()
    log('forward')
}

const playSong = () => {
    let button = e('#id-button-play')
    let a = e('#id-audio-player')
    let isPause = a.paused
    if (isPause) {
        log('play it')
        let b = button.querySelector('.fa-play')
        b.className = 'fa fa-pause'
        a.play()
    } else {
        log('pause it')
        let b = button.querySelector('.fa-pause')
        b.className = 'fa fa-play'
        a.pause()
    }
}

const bindEventPlay = function () {
    let button = e('#id-button-play')
    button.addEventListener('click', function (event) {
        playSong()
    })
}

const bindEventBackward = function () {
    let button = e('#id-button-backward')
    let a = e('#id-audio-player')
    button.addEventListener('click', function (event) {
        playBackward(a)
    })
}

const bindEventForward = function () {
    let a = e('#id-audio-player')
    let button = e('#id-button-forward')
    button.addEventListener('click', function (event) {
        playForward(a)
    })
}

const bindRandom = () => {
    let button = e('#id-button-random')
    button.addEventListener('click', function (event) {
        config.random = !config.random
        if (config.random) {
            button.classList.add('btn-active')
        } else {
            button.classList.remove('btn-active')
        }
    })
}

const bindCircle = () => {
    let button = e('#id-button-circle')
    button.addEventListener('click', function (event) {
        config.circle = !config.circle
        if (config.circle) {
            button.classList.add('btn-active')
        } else {
            button.classList.remove('btn-active')
        }
    })

}


const bindEventEnded = function (audio) {
    let a = e('#id-audio-player')
    let lib = playList()
    a.addEventListener('ended', function () {
        let index = a.dataset.index
        let circle = config.circle
        let isNext = index < lib.length - 1
        // 还没播完
        if (isNext) {
            playForward(a)
        } else {
            // 播完是否循环播放
            if (circle) {
                playForward(a)
            }
        }
    })
}

const choice = function (array) {
    // 1. 得到  0 - 1 之间的小数 a
    // 2. 把 a 转成 0 - array.length 之间的小数
    // 3. 得到 0 - array.length - 1 之间的整数作为下标
    // 4. 得到 array 中的随机元素
    let r = Math.random()
    r = r * (array.length)
    r = Math.floor(r)
    log('random r is', r)
    return r
}

const renderPlayer = function (current, duration) {
    return
    let ratio = current / duration * 100
    // ratio = Math.round(ratio)
    ratio = ratio.toFixed(1)
    let sheets = document.styleSheets[2]
    let progress = `
    .range:before {
        width: ${ratio}%;
    }
    `
    let dotProgress = `
    .range:after {
        left: ${ratio}%;
    }
    `
    // log(progress, dotProgress)
    sheets.deleteRule(0)
    sheets.deleteRule(0)
    sheets.insertRule(progress, 0)
    sheets.insertRule(dotProgress, 0)


    // log(p, sheets)
    // log('ratio', current, duration, ratio)
}

const bindEventCanplay = function () {
    let a = e('#id-audio-player')
    a.addEventListener('canplay', function (event) {
        log('play can it')
        if (config.renderId) {
            clearInterval(config.renderId)
        }
        // renderPlayer(a.currentTime, a.duration)
        config.renderId = setInterval(function () {
            renderPlayer(a.currentTime, a.duration)
        }, 500)
    })
}

const bindEvents = function () {

    bindEventPlay()
    bindEventBackward()
    bindEventForward()

    bindCircle()
    bindRandom()

    // 播放结束之后
    bindEventEnded()

    // 时间轴事件
    bindEventCanplay()

}

const __main = function () {
    log('main begin')
    bindEvents()
}

__main()