import {MessageSender, PremiumPopup} from './plugins/message-sender'
import NotificationFetcher from './plugins/messages-fetcher'

if (window.CAN_SEND_MSG) {
    (new class extends MessageSender {
        constructor() {
            super(...arguments)
        }

        init() {
            super.init(...arguments)
            let profiles = document.querySelectorAll('.contact-box')
            for (let profile of profiles) {
                profile.addEventListener('click', () => {
                    let id = profile.querySelector('.profile-id').textContent
                    this.modal.find('.send-msg-modal-chat-link')
                        .attr('href', `/chats/?selected=${id}`)
                    this.receiverId = +id
                })
            }
        }
    }('#send-msg-modal', '#send-msg-btn')).init()
} else {
    new PremiumPopup('#get-premium-modal').init()
}

new NotificationFetcher().init()

function onDelete() {
    let id = $(this).attr('data-id')
    let type = $(this).attr('data-type')
    if (type == 'like' || type == 'sympathy') {
        $.post(`/likes/likes/${id}/delete/`)
    } else if (type == 'visit') {
        $.post(`/visits/${id}/delete/`)
    }
    $(this).closest(`.contact-box[data-id="${id}"]`).remove()
}

(function init() {
    $('.delete-info').click(onDelete)
})()
