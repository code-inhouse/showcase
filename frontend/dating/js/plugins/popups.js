const template = `
    <img class="popup-img"></img>
    <div class="popup-content">
        <p class="sender">Maya</p>
        <p class="body">some content</p>
    </p>
    <div class="clearfix"></div>
`

const POPUP_HEIGHT = 80
const POPUP_PADDING = 30

export class Popup {
    constructor(imgSrc, sender, body, onClickUrl) {
        this.popup = this.makePopupNode()
        this.popup.querySelector('.popup-img').setAttribute('src', imgSrc)
        this.popup.querySelector('.sender').textContent = sender
        this.popup.querySelector('.body').textContent = body
        this.popup.addEventListener('click', () => {
            window.location.href = onClickUrl
        })
        document.body.appendChild(this.popup)
    }

    makePopupNode() {
        let popup = document.createElement('div')
        popup.innerHTML = template
        popup.style.bottom = '-130px'
        popup.classList.add('popup')
        return popup
    }
}

export default class {
    constructor(popupLimit=2) {
        this.popups = []
        this.popupLimit = popupLimit
        this.audio = document.querySelector('audio')
        if (!this.audio) {
            this.audio = {play: () => {}}
        }
    }

    addPopup(newPopup) {
        this.popups = [newPopup, ...this.popups]
        newPopup.popup.addEventListener('transitionend', e => {
            if (e.propertyName == 'bottom') {
                newPopup.popup.classList.add('fadeout')
            } else if (e.propertyName == 'opacity') {
                newPopup.popup.parentElement.removeChild(newPopup.popup)
            }
        })
        for (let i = 0; i < this.popups.length; i++) {
            let popup = this.popups[i]
            window.getComputedStyle(popup.popup).bottom
            popup.popup.style.bottom =
                `${POPUP_PADDING + (POPUP_HEIGHT + POPUP_PADDING)  * i}px`
        }
        if (this.popups.length > this.popupLimit) {
            let lastPopup = this.popups.pop()
            lastPopup.popup.style.right = '-310px'
        }
        this.audio.play()
    }
}
