import xhr from 'xhr'

import getCookie from '../utils/getCookie'
import Profile from './profile'
import initQuestions from './questions'
import initLikes from './likes'
import initPhotos from './photos'
import initProfileSettings, {initDescription} from './profile-settings'
import {MessageSender, PremiumPopup}  from '../plugins/message-sender'
import MessageFetcher from '../plugins/messages-fetcher'
import photoBanner from './photos/photo-banner'


init(new Profile(window.PROFILE_CONFIG))


function init(profile) {
    initModerator(profile)
    initDescription(profile)
    new MessageFetcher('#unread-messages-count', '#notification-label').init()
    if (window.OWN) {
        initOwn(profile)
    } else {
        initNotOwn(profile)
    }
}

function initModerator(profile) {
    let btn = document.getElementById('delete-profile-btn')
    if (btn) {
        $(btn).click(() => {
            $('#delete-profile-confirmation-modal').modal('show')
        })
        $('#confirm-profile-deletion-btn').click(() => {
            $.post(`/moderator/delete/${profile.id}/`)
                .done(() => {
                    window.location.href = window.location.href
                })
        })
    }
}


function initOwn(profile) {
    initProfileSettings(profile)
    let store = initQuestions()
    initPhotos(store)
    let changeInvisibility = $('#change-invisibility')
    changeInvisibility.click(e => {
        let suffix = changeInvisibility.is(':checked') ? 'on' : 'off'
        $.post(`/invisible/${suffix}/`, data => {
            console.log(data)
        })
    })
}

function initSendMessage() {
    window.emojioneVersion = "3.0.0";
    $('#send-msg-input').emojioneArea({
        tones: false,
        autocomplete: false,
        hidePickerOnBlur: false,
        placeholder: __('Введите сообщение'),
        pickerPosition: "bottom",
    })[0]
}

function initNotOwn(profile) {
    initSendMessage()
    initLikes(profile)
    if (window.CAN_SEND_MSG) {
        new MessageSender(
                '#send-msg-modal',
                '#send-msg-btn',
                window.PROFILE_CONFIG.id)
            .init()
    } else {
        new PremiumPopup('#get-premium-modal').init()
    }
    initQuestions()
    if (!window.CAN_SEE_BIG_PHOTOS) {
        if ($('#avatar').attr('src').indexOf('default') == -1) {
            $('#avatar').click(() => {
                photoBanner.show()
            })
        }
        $('.lightbox__small-photo').click(() => {
            photoBanner.show()
        })
    }
    document.getElementById('avatar').addEventListener('click', () => {
        let avaGallery = document.getElementById('avatar-gallery')
        avaGallery.click()
    })
    document.getElementById('encourage-btn').addEventListener('click', () => {
        $.post(`/chats/encourage/${profile.id}/`)
            .done(res => {
                document.getElementById('no-answers-encourage')
                    .setAttribute('hidden', true)
                document.getElementById('no-answers-no-encourage')
                    .removeAttribute('hidden')
                console.log(res)
            })
            .fail(err => console.error(err))
    })
}
