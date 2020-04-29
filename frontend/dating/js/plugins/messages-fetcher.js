import xhr from 'xhr'

import getDate from '../utils/relative-date'
import {DEFAULT_AVATAR} from '../config'
import PopupManager, {Popup} from './popups.js'

const FETCH_INTERVAL = 15000
const NEW_MESSAGES_TO_SHOW = 3

const MESSAGES = {
    like: {
        male: __('Вы ему понравились'),
        female: __('Вы ей понравились!')
    },
    visit: {
        male: __('зашел на Вашу страницу'),
        female: __('зашла на Вашу страницу')
    },
    message: {
        male: __('прислал Вам личное сообщение'),
        female: __('прислала Вам личное сообщение')
    },
    mutual: {
        male: __('у вас взаимная симпатия, поздравляем!'),
        female: __('у вас взаимная симпатия, поздравляем!')
    }
}

const URLS = {
    like: '/likes/info/',
    message: '/chats/',
    visit: '/likes/info/',
    mutual: '/likes/game/'
}

class Publisher {
    constructor(subscribers=[]) {
        this.subscribers = subscribers
    }

    notify() {
        for (let subscriber of this.subscribers) {
            subscriber(...arguments)
        }
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber)
        return () => {
            this.subscribers.splice(this.subscribers.indexOf(subscriber), 1)
        }
    }
}

export class Fetcher {
    constructor(
        type,
        popupManager,
        lastIdKey,
        countKey,
        profilePrefix,
        dateKey,
        url,
        countUrl) {
            this.publisher = new Publisher()
            this.lastId = 0
            this._count = 0
            this.popupManager = popupManager || {addPopup: () => {}}
            this.lastIdKey = lastIdKey
            this.countKey = countKey
            this.profilePrefix = profilePrefix
            this.dateKey = dateKey
            this.type = type
            this.url = url
            this.countUrl = countUrl
    }

    init() {
        this.fetchCounts()
        setInterval(this.fetch, FETCH_INTERVAL)
    }

    get count() {
        return this._count
    }

    set count(val) {
        this._count = val
        this.publisher.notify(val)
    }

    fetchCounts() {
        $.get(this.countUrl)
            .done(this.onInitialFetch)
            .fail(console.error)
    }

    onInitialFetch = data => {
        this.lastId = data.last_id
        this.count = data.count
    }

    getComparator = key => (a, b) => {
        if (a[key] < b[key]) return -1
        return 1
    }

    getMapper = key => x => {
        return Object.assign({}, x, {
            key: new Date(x[key])
        })
    }

    fetch = () => {
        $.get(`${this.url}?last_id=${this.lastId}`)
            .done(this.onFetch)
            .fail(console.error)
    }

    onFetch = data => {
        let items = data.items.map(this.getMapper(this.dateKey))
        items.sort(this.getComparator(this.dateKey))
        if (items.length) {
            this.lastId = items[items.length - 1].id
        }
        for (let item of items) {
            let sex = item[`${this.profilePrefix}_sex`]
            this.popupManager.addPopup(new Popup(
                item[`${this.profilePrefix}_avatar`] || DEFAULT_AVATAR,
                item[`${this.profilePrefix}_name`],
                MESSAGES[this.type][sex],
                URLS[this.type]
            ))
        }
        this.count += items.length
    }
}

let manager = new PopupManager()

export let messageFetcher = new Fetcher(
    'message',
    manager,
    'lastMessageId',
    'messageCount',
    'sender',
    'sent',
    '/chats/messages/unread/',
    '/chats/messages/count/'
)

export let likeFetcher = new Fetcher(
    'like',
    manager,
    'lastLikeId',
    'likeCount',
    'liker',
    'created',
    '/likes/likes/unread/',
    '/likes/likes/count/'
)

export let mutualFetcher = new Fetcher(
    'mutual',
    manager,
    'lastMessageId',
    'messageCount',
    'liked',
    'created',
    '/likes/mutual/',
    '/likes/mutual/count/'
)

export let visitFetcher = new Fetcher(
    'visit',
    manager,
    'lastVisitId',
    'visitCount',
    'visitor',
    'created',
    '/visits/unread/',
    '/visits/count/'
)

export let taskFetcher = new class {
    init() {
        this.task = window.TASK || null
        this.publisher = new Publisher()
        this.intervalId = setInterval(this.fetch, 5000)
    }

    fetch = () => {
        $.get(`/achievements/task/`)
            .done(this.onFetch)
            .fail(console.error)
    }

    onFetch = task => {
        this.publisher.notify(task)
        if (!this.task ||
            task.id != this.task.id ||
            task.name != this.task.name) {
            window.completeTask(
                task.userRating,
                task
            )
            this.updateTaskInfo(task)
            this.updateUserData(task)
            this.task = task
            if (!this.task) {
                clearInterval(this.intervalId)
            }
        }
    }

    updateTaskInfo(task) {
        $('#current-task-info').text(task.description)
        $('#next-rating-info').text(task.userRating+task.award)
    }

    updateUserData(task) {
        $('#current-user-rating .rating')
            .text(task.userRating + '%')
        $('#current-user-rating .rank')
            .text(task.usreRank)
    }
}

export function updateHeaderNotificationLabel(
    messageCount=0,
    likeCount=0,
    visitCount=0) {
    let count = messageCount + likeCount + visitCount
    if (count) {
        $('.dropdown-menu.dropdown-alerts').removeAttr('style')
        $('#notification-label').text(count)
        $('#notification-messages').text(`${messageCount} новых сообщений`)
        $('#notification-likes').text(`${likeCount} новых симпатий`)
        $('#notification-visits').text(`${visitCount} новых посещений`)
    } else {
        $('#notification-label').text('')
        $('.dropdown-menu.dropdown-alerts')
            .attr('style', 'display: none;')
    }
}

export function updateNavLikeVisitLabel(likeCount, visitCount) {
    let visitLikeCount = likeCount + visitCount
    $('#nav-likes-visits-notification').text(visitLikeCount ?
        `+${visitLikeCount}` : '')
}

export function updateNavMessageLabel(messageCount) {
    $('#nav-messages-notifications').text(messageCount ?
        `+${messageCount}` : '')
}

export function updateNavMutualLabel(mutualCount) {
    $('#nav-mutual-notifications').text(mutualCount ?
        `+${mutualCount}` : '')
}

export default class {
    constructor(includes=null) {
        this.messagesCount = 0
        this.likeCount = 0
        this.visitCount = 0
        this.messageFetcher = messageFetcher
        this.likeFetcher = likeFetcher
        this.visitFetcher = visitFetcher
        this.mutualFetcher = mutualFetcher
        this.taskFetcher = taskFetcher
        this.messageFetcher.publisher.subscribe(val => {
            this.messageCount = val
            this.update()
        })
        this.likeFetcher.publisher.subscribe(val => {
            this.likeCount = val
            this.update()
        })
        this.visitFetcher.publisher.subscribe(val => {
            this.visitCount = val
            this.update()
        })
        this.mutualFetcher.publisher.subscribe(val => {
            this.mutualCount = val
            this.update()
        })
        this.fetchers = [
            this.messageFetcher,
            this.likeFetcher,
            this.visitFetcher,
            this.mutualFetcher,
            this.taskFetcher
        ]
        this.includes = includes || this.fetchers.map(_ => true)
    }

    init() {
        for (var i = 0; i < this.fetchers.length; i++) {
            if (this.includes[i]) {
                this.fetchers[i].init()
            }
        }
    }

    update() {
        updateHeaderNotificationLabel(
            this.messageCount, this.likeCount, this.visitCount)
        updateNavLikeVisitLabel(this.likeCount, this.visitCount)
        updateNavMessageLabel(this.messageCount)
        updateNavMutualLabel(this.mutualCount)
    }
}
