import xhr from 'xhr'

import {russianAge} from '../utils/localization'
import getCookie from '../utils/getCookie'
import MessageFetcher from '../plugins/messages-fetcher'
import {MessageSender, PremiumPopup, makeRedirectionPopup} from '../plugins/message-sender'


const VISIBLE_QUEUE_LEN = 6
const DEFAULT_IMG = '/static/images/default_avatar.png'


function getMediaUrl(url) {
    return `${url}`
}

function bdayToAge(bday) {
    const MILISECONDS_IN_YEAR = 60 * 60 * 24 * 365 * 1000
    return Math.floor((new Date() - new Date(bday)) / MILISECONDS_IN_YEAR)
}

let mutualLikes = new class {
    init(matches) {
        $('#mutual-like-loader').hide()
        this.matches = matches.map(this.normalizeMatch)
        this._msgSender = new MessageSender(
            '#send-msg-modal',
            '#send-msg-btn')
        this._getPremium = new PremiumPopup('#get-premium-modal')
        this._msgSender.init()
        this._getPremium.init()
        // this.msgSender = msgSender
        // this.msgSender.init()
        $('#mutual-send-message').click(this.onSendMsg)
        $('#mutual-next-btn').click(this.onNext)
        this.update()
    }

    get curMatch() {
        return this.matches[0]
    }

    normalizeMatch(match) {
        let {
            id,
            liked_id,
            liked_avatar,
            liked_name,
            liked_sex,
            liked_birthday,
            canSendMessage
        } = match
        return {
            id: liked_id,
            likeId: id,
            thumbnailUrl: liked_avatar || DEFAULT_IMG,
            name: liked_name,
            age: bdayToAge(liked_birthday),
            canSendMessage
        }
    }

    append(...matches) {
        this.matches = this.matches.concat(matches)
        this.update()
    }

    update() {
        if (this.matches.length) {
            this.msgSender = (
                this.curMatch.canSendMessage ?
                this._msgSender :
                this._getPremium
            )
            $('#mutual-like-avatar')
                .css(
                    'backgroundImage',
                    `url(${this.curMatch.thumbnailUrl})`)
            $('#mutual-like-name').text(this.curMatch.name)
            $('#mutual-like-age').text(russianAge(this.curMatch.age))
            $('.mutual-profile-link')
                .attr('href', `/profile/${this.curMatch.id}/`)
            $('#mutual-like-block').show()
            $('#mutual-like-banner').hide()
        } else {
            $('#mutual-like-block').hide()
            $('#mutual-like-banner').show()
        }
    }

    onSendMsg = () => {
        this.msgSender.receiverId = this.curMatch.id
        if (this.msgSender == this._msgSender){
            $('#send-msg-modal').modal('toggle')
        } else {
            $('#get-premium-modal').modal('toggle')
        }
    }

    onNext = () => {
        $.post(`/likes/viewmutual/${this.curMatch.likeId}/`)
            .fail(console.error)
        this.matches = this.matches.slice(1)
        this.update()
    }

}


let game = new class {
    init(matches) {
        this._msgSender = new MessageSender(
            '#send-msg-modal',
            '#send-msg-btn')
        this._getPremium = new PremiumPopup('#get-premium-modal')
        this._msgSender.init()
        this._getPremium.init()
        this.likesRestrictionPopup = new (makeRedirectionPopup(
            '#get-premium-modal-likes',
            '',
            '',
            () => `/payments/click?source=more_likes_popup_auto&button=premium&page_url=${window.location.href}`
        ))(10000)
        this.likesRestrictionPopup.init()
        this.matches = matches.map(this.normalizeMatch)
        this.matchCounter = 0
        this.restrictedLikes = window.HAS_LIKE_RESTRICTION
        this.liked = window.LIKED
        this.allowedLikes = window.LIKES_PER_DAY
        let nextIcons = []
        for (let i = 0; i < VISIBLE_QUEUE_LEN; i++) {
            nextIcons.push(document.getElementById(`next-icon-${i+1}`))
        }
        this.elements = {
            prevIcon: document.getElementById('prev-icon'),
            curIcon: document.getElementById('cur-icon'),
            nextIcons,
            likeBtn: document.getElementById('like-btn'),
            dislikeBtn: document.getElementById('dislike-btn'),
            photo: document.getElementById('photo'),
            name: document.getElementById('name'),
            age: document.getElementById('age'),
            matchProbability: document.getElementById('match-probability'),
            statusSign: document.getElementById('status-sign'),
            profilePhotoLink: document.getElementById('profile-photo-link')
        }
        this.elements.likeBtn.addEventListener('click', this.like)
        this.elements.dislikeBtn.addEventListener('click', this.dislike)
        this.initEvents()
        document.getElementById('send-msg-button')
            .addEventListener('click', this.onSendMsg)
        document.getElementById('game').removeAttribute('hidden')
    }

    initEvents() {
        this.elements.prevIcon
            .addEventListener('click', this.onPrevMatchClick)
        this.elements.curIcon
            .addEventListener('click', this.onMatchNavClick(0))
        this.elements.profilePhotoLink
            .addEventListener('click', this.onMatchClick)
        for (let i = 1; i < 6; i++) {
            document.getElementById(`next-icon-${i}`)
                .addEventListener('click', this.onMatchNavClick(i))
        }
    }

    onPrevMatchClick = e => {
        if (!this.checkLikeRestriction()) {
            this.likesRestrictionPopup.show()
            return
        }
        let prevMatch = this.matches[this.matchCounter - 1]
        if (prevMatch) {
            window.location.href = `/profile/${prevMatch.id}`
        }
    }

    onMatchClick = e => {
        this.onMatchNavClick(0)(e)
    }

    onMatchNavClick = index => e => {
        if (!this.checkLikeRestriction()) {
            this.likesRestrictionPopup.show()
            return
        }
        let match = this.matches[this.matchCounter + index]
        if (match) {
            window.location.href = `/profile/${match.id}`
        }
    }

    get curMatch() {
        return this.matches[this.matchCounter]
    }

    get matchProbability() {
        const LOWER_BOUND = 60
        const UPPER_BOUND = 95
        return LOWER_BOUND + Math.floor(
            Math.random() * (UPPER_BOUND - LOWER_BOUND)
        )
    }

    normalizeMatch(match) {
        let {
            name,
            birthday,
            avatarUrl,
            thumbnailUrl,
            likedMe,
            status,
            canSendMessage
        } = match
        let age = bdayToAge(birthday)
        return {
            id: match.pk,
            name: name,
            age: age,
            avatarUrl: avatarUrl || DEFAULT_IMG,
            thumbnailUrl: thumbnailUrl || DEFAULT_IMG,
            status,
            likedMe,
            canSendMessage
        }
    }

    renderIcons() {
        if (this.matchCounter > 0) {
            let prevMatch = this.matches[this.matchCounter - 1]
            this.elements.prevIcon
                .setAttribute('src', getMediaUrl(prevMatch.thumbnailUrl))
            this.elements.prevIcon.removeAttribute('hidden')
        } else {
            this.elements.prevIcon.setAttribute('hidden', true)
        }
        this.elements.curIcon
            .setAttribute('src', getMediaUrl(this.curMatch.thumbnailUrl))
        for (let queueIndex = 0; queueIndex < VISIBLE_QUEUE_LEN - 1; queueIndex++) {
            var match = this.matches[this.matchCounter + queueIndex + 1]
            let nextIcon = this.elements.nextIcons[queueIndex]
            if (match) {  // something left in queue
                let {thumbnailUrl} = match
                nextIcon.setAttribute('src', thumbnailUrl)
            } else {
                nextIcon.setAttribute('hidden', true)
            }
        }
    }

    renderCurMatch() {
        this.elements.photo.setAttribute('src', this.curMatch.avatarUrl)
        this.elements.name.textContent = this.curMatch.name
        this.elements.age.textContent = russianAge(this.curMatch.age)
        this.elements.matchProbability.textContent =
            `${this.matchProbability}%`
        this.elements.statusSign
            .classList.remove('ava-status-sign__premium')
        this.elements.statusSign
            .classList.remove('ava-status-sign__vip')
        this.elements.statusSign
            .classList.add(`ava-status-sign__${this.curMatch.status}`)
    }

    render() {
        if (this.matchCounter >= this.matches.length) {
            document.getElementById('game').setAttribute('hidden', true)
            document.getElementById('game-over').removeAttribute('hidden')
        } else {
            this.msgSender = (
                this.curMatch.canSendMessage ?
                this._msgSender :
                this._getPremium
            )
            this.renderIcons()
            this.renderCurMatch()
        }
    }

    clearPrevIconForeground() {
        let icon = document.getElementById('prev-icon-foreground')
        icon.classList.remove('fa-times')
        icon.classList.remove('fa-heart')
    }

    checkLikeRestriction() {
        if (this.restrictedLikes &&
            this.liked >= this.allowedLikes - 1) {
            return false
        }
        return true
    }

    like = e => {
        if (!this.checkLikeRestriction()) {
            this.likesRestrictionPopup.show()
            return
        }
        this.liked++
        this.clearPrevIconForeground()
        xhr.post(`/likes/like/${this.curMatch.id}/`, {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        }, this.onLikeOrDislike)
        document.getElementById('prev-icon-foreground')
            .classList.add('fa-heart')
        this.render()
    }

    dislike = e => {
        if (!this.checkLikeRestriction()) {
            this.likesRestrictionPopup.show()
            return
        }
        this.liked++
        this.clearPrevIconForeground()
        xhr.post(`/likes/dislike/${this.curMatch.id}/`, {
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        }, this.onLikeOrDislike)
        document.getElementById('prev-icon-foreground')
            .classList.add('fa-times')
        this.render()
    }

    onLikeOrDislike = (err, response, body) => {
        if (err) {
            console.error(err)
        } else {
            try{
                body = JSON.parse(body)
            } catch(e) {
                console.log()
            }
            if (body.id && this.curMatch.likedMe) {
                mutualLikes.append(Object.assign({}, this.curMatch, {
                    likeId: body.id
                }))
            }
        }
        this.matchCounter++
        this.render()
    }

    onSendMsg = e => {
        this.msgSender.receiverId = this.curMatch.id
        if (this.msgSender == this._msgSender){
            $('#send-msg-modal').modal('toggle')
        } else {
            $('#get-premium-modal').modal('toggle')
        }
    }
}

function hideInfoPopup() {
    document.getElementById('info-popup').setAttribute('hidden', true)
    localStorage.setItem('infoPopupHidden', true)
}

xhr.get('/likes/matches/', (err, res, body) => {
    let matches = JSON.parse(body)
    let loader = document.getElementById('loader')
    loader.setAttribute('hidden', true)
    game.init(matches.matches)
    game.render()
})

$('#mutual-like-banner').hide()
$('#mutual-like-block').hide()
$.get('/likes/mutual/')
    .done(data => {
        mutualLikes.init(data.items)
    })
    .fail(console.error)

new MessageFetcher([true, true, true, false, true]).init()
if (localStorage && localStorage.getItem('infoPopupHidden')) {
    hideInfoPopup()
}
document.getElementById('close-info-popup')
    .addEventListener('click', hideInfoPopup)

function initBanners() {
    let functionsManager = new class {
        constructor(fns) {
            this.functions = fns
            this.index = 0
        }

        map(f) {
            return this.functions.map(f)
        }

        get length() {
            return this.functions.length
        }

        next() {
            if (this.length) {
                this.index = (this.index + 1) % this.length
                return this.functions[this.index]
            }
            return null;
        }
    }(GET_BANNERS())

    function cycleBanners(container1, container2, interval=20000) {
        let filter = _functions => {
            let functions = _functions.map(x => x)
            let index = functions.indexOf(plugVip)
            if (index > -1 && IS_VIP) {
              functions.splice(index, 1);
            }
            index = functions.indexOf(plugPremium);
            if (index > -1 && (IS_PREMIUM || IS_VIP)) {
              functions.splice(index, 1);
            }
            index = functions.indexOf(plugEmulation);
            if (index > -1 && CAN_EMULATE) {
              functions.splice(index, 1)
            }
            return functions
        }
        var cycle = () => {
            functionsManager.functions = filter(functionsManager.functions)
            let function1 = functionsManager.next()
            let function2 = functionsManager.next()
            if (function1 == function2) {
                container2.style.display = 'none'
            } else {
                function2(container2, cycle)
            }
            if (!function1) {
                container1.style.display = 'none'
                return
            }
            function1(container1, cycle)
        }
        cycle();
        setInterval(cycle, interval);
    }

    cycleBanners(
        document.getElementById('second-banner'),
        document.getElementById('mutual-like-banner')
    )
}

initBanners()
