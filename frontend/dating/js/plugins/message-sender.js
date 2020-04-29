export class MessageSender {
    constructor(modalQuery, sendBtnQuery, receiverId) {
        this.receiverId = receiverId
        this.modal = $(modalQuery)
        this.sendBtn = document.querySelector(sendBtnQuery)
        this.input = $(`${modalQuery} textarea`)
                     .emojioneArea({
                        pickerPosition: "bottom"
                     })[0]
                     .emojioneArea
        this.inited = false
    }

    init() {
        if (!this.inited) {
            this.inited = true
            this.sendBtn.addEventListener('click', this.onSend)
        }
    }

    onSend = e => {
        let message = this.input.getText().trim()
        if (!message) {
            this.modal.find('.error-message').css('visibility', 'visible')
            return
        } else {
            this.modal.find('.error-message').css('visibility', 'hidden')
        }
        this.sendBtn.setAttribute('disabled', true)
        this.sendBtn.textContent = __('Отправляем...')
        $.post(`/chats/sendmessage/`, {
            message,
            to: this.receiverId
        })
        .done(data => {
            this.modal.modal('hide')
            this.input.setText('')
            this.sendBtn.removeAttribute('disabled')
            this.sendBtn.textContent = __('Отправить сообщение')
        })
        .fail(err => {
            console.error(err)
        })
    }
}


export function makeRedirectionPopup(query, title, body, url) {
    return class {
        constructor(delay=5000) {
            this.interval = null
            this.delay = delay
            this.inited = false
            this.modal = $(query)
        }

        get url() {
            if (typeof url === 'function') {
                return url()
            }
            return url
        }

        init() {
            if (!this.inited) {
                this.inited = true
                this.modal.find('.btn.btn-green').attr('href', this.url)
                this.modal.on('show.bs.modal', this.onShow)
                this.modal.on('hide.bs.modal', this.onClose)
            }
        }

        redirect = () => {
            window.location.href = this.url
        }

        show() {
            if (title) {
                this.modal.find('.modal-title').html(title)
            }
            if (body) {
                this.modal.find('.modal-body').html(body)
            }
            this.modal.modal('show')
        }

        onShow = () => {
            this.interval = setInterval(this.redirect, this.delay)
        }

        onClose = () => {
            if (this.interval) {
                clearInterval(this.interval)
            }
        }
    }
}


export const PremiumPopup = makeRedirectionPopup(
    '#get-premium-modal',
    __('Хочешь отправить сообщение?'),
    __('<i></i><p>Стань <strong>ПРЕМИУМ</strong> пользователем и знакомся без ограничений</p>'),
    () => `/payments/click?source=send_message_popup_auto&button=premium&page_url=${window.location.href}`
)

export default MessageSender
