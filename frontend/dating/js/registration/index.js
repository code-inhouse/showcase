import xhr from 'xhr'

import getCookie from '../utils/getCookie'

import * as controllers from './controllers'
import {State} from './state'
import stateManager from './state-manager'
import * as validators from './validators'
import * as states from './states'
import * as constants from './constants'


let cropper, imageSize

function clearAvaChangeOnClick(elem) {
    let label = elem.parentElement.parentElement
    label.removeAttribute('for')
}

window.VK_AUTH = !!window.VK_DATA


function makeCropper(img) {
    return new Cropper(img, {
        aspectRatio: 1,
        viewMode: 1,
        restore: true,
        guides: false,
        center: false,
        zoomable: false,
        minCropBoxWidth: 50,
        minCropBoxHeight: 50,
        minContainerWidth: 335,
        minContainerHeight: 335,
        crop: function(e) {
            let {x, y, width, height} = cropper.getData()
            document.getElementById('id_rel_left')
                .value = x / imageSize.width
            document.getElementById('id_rel_top')
                .value = y / imageSize.height
            document.getElementById('id_rel_width')
                .value = width / imageSize.width
            document.getElementById('id_rel_height')
                .value = height / imageSize.height
        }
    })
}


document.querySelector('#finish-general-step')
    .addEventListener('click', () => {
        if (stateManager.curState.isValid(true)) {
            stateManager.curState.save()
            stateManager.stepForward()
        } else {
            stateManager.curState.displayErrors(true)
        }
    }
)


document.querySelector('#finish-auth-data-step')
    .addEventListener('click', e => {
        if (e.target.classList.contains('disabled')) {
            return
        }
        if (stateManager.curState.isValid(true)) {
            let inputs = document.querySelectorAll('#auth-data-step input')
            let nextStepBtn = document.querySelector('#finish-auth-data-step')
            for (let input of inputs) {
                input.setAttribute('disabled', true)
            }
            if (!window.VK_AUTH) {
                nextStepBtn.classList.add('disabled')
                nextStepBtn.textContent = __('Секундочку...')
                let email = document.querySelector('#email-input').value
                xhr.get(`/emailcheck?email=${email}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    }
                }, (err, response, body) => {
                    if (err) {
                        alert(err)
                    }
                    if (body == 'taken') {
                        let takenEmails = (localStorage.getItem('takenEmails') || '')
                            .split(',')
                        takenEmails.push(document.querySelector('#email-input').value)
                        localStorage.setItem('takenEmails', takenEmails)
                        stateManager.curState.displayErrors(true)
                    } else {
                        stateManager.curState.save()
                        stateManager.stepForward()
                    }
                    for (let input of inputs) {
                        input.removeAttribute('disabled')
                    }
                    nextStepBtn.classList.remove('disabled')
                    nextStepBtn.textContent = __('Продолжить')
                })
            } else {
                stateManager.curState.save()
                stateManager.stepForward()
            }
        } else {
            stateManager.curState.displayErrors(true)
        }
    }
)


document.getElementById('finish-questionnaire-step')
    .addEventListener('click', e => {
        if (stateManager.curState.isValid(true)) {
            stateManager.curState.save()
            stateManager.stepForward()
        } else {
            stateManager.curState.displayErrors(true)
        }
    })


document.getElementById('id_image')
    .addEventListener('change', e => {
        let input = e.target
        if (input.files && input.files[0]) {
            let reader = new FileReader()
            reader.onload = e => {
                let imageUrl = e.target.result
                let image = new Image()
                image.addEventListener('load', () => {
                    imageSize = {
                        width: image.width,
                        height: image.height
                    }
                })
                image.src = imageUrl
                let ava = document.querySelector('.avatar')
                ava.setAttribute('src', imageUrl)
                clearAvaChangeOnClick(ava)
                if (cropper) {
                    cropper.replace(imageUrl)
                } else {
                    cropper = makeCropper(ava)
                }
            }
            reader.readAsDataURL(input.files[0])
        }
    }
)


document.getElementById('finish-photo-step')
    .addEventListener('click', e => {
        if (e.target.classList.contains('disabled')) {
            return
        }
        if (stateManager.curState.isValid(true)) {
            e.target.classList.add('disabled')
            e.target.textContent = __('Регистрируем...')
            if (localStorage) {
                for (var lsKey in constants) {
                    if (lsKey) {
                        localStorage.removeItem(lsKey)
                    }
                }
            }
            document.getElementById('form-for-submission').submit()
        } else {
            stateManager.curState.displayErrors(true)
        }
    }
)


stateManager.push(
    states.firstStep,
    states.authDataStep,
    states.questionnaireStep,
    states.dummyQuestions
)


stateManager.push(new class extends State {
    onNextStep() {
        document.body.classList.remove('registration--step-4')
        document.body.classList.add('registration--step-5')
        if (window.VK_AUTH) {
            yaCounter42711874.reachGoal('SocialRegistration Step 4')
        } else {
            yaCounter42711874.reachGoal('Registration Step 5')
        }
    }
}('photo-control', {
    photo: {
        controller: controllers.photoController,
        validator: validators.photoSizeValidator,
    }
}))

stateManager.stepForward()

let undos = document.querySelectorAll('.back-btn')
for (let btn of undos) {
    btn.addEventListener('click', e => {
        stateManager.stepBack()
        for (let i = 2; i <= 6; i++) {
            let sel = document.querySelector(`.registration--step-${i}`)
            if (sel) {
                sel.classList.remove(`registration--step-${i}`)
                sel.classList.add(`registration--step-${i-1}`)
                break
            }
        }
    })
}


(function logRepost() {
    let loc = window.location.href
    let pattern = 'accounts/signup'
    let source = loc
        .slice(loc.indexOf(pattern) + pattern.length)
        .split('/')
        .filter(x => !!x)
        [0]
    if (source) {
        xhr.post(
            window.location.href, {
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
            }, (err, res) => {
                if (err) {
                    console.log(err);
                }
                console.log(res)
            })
    }
})();


(function getVkData() {
    if (window.VK_DATA) {
        let data = JSON.parse(VK_DATA)
        data.photo = data.photo_max_orig || data.photo_big || ''
        window.VK_OBJ = data
        if (!window.localStorage) {
            window.localStorage = {
                setItem: function() {},
                clear: function() {}
            }
        }
        window.localStorage.clear()
        onVkUserInfo(data)
        document.querySelector('#start-vk-auth')
            .style.display = 'none'
    }
    function onVkUserInfo (data) {
        localStorage.clear()
        let {
            sex,
            bdate,
            first_name,
            last_name,
            photo,
            email
        } = data
        let $$ = document.getElementById.bind(document)
        var evt = document.createEvent('HTMLEvents')
        evt.initEvent('input', true, true)
        if (sex == 1) {
            $$('sex-female-btn').click()
            $$('looking-for-male-btn').click()
        } else if (sex == 2) {
            $$('sex-male-btn').click()
            $$('looking-for-female-btn').click()
        }
        let name = `${first_name} ${last_name}`
        $$('name-input').value = name
        $$('name-input').dispatchEvent(evt)
        localStorage.setItem(constants.LS_NAME, name)
        if (email) {
            $$('email-input').value = email
            $$('email-input').dispatchEvent(evt)
            localStorage.setItem(constants.LS_MAIL, email)
        }
        let [day, month, year] = bdate.split('.')
        $$('bdate-day-input').value = day
        $$('bdate-month-input').value = month
        $$('bdate-year-input').value = year
        $$('bdate-day-input').dispatchEvent(evt)
        $$('bdate-month-input').dispatchEvent(evt)
        $$('bdate-year-input').dispatchEvent(evt)
        $$('password-input').value = 'qweasdzxc'
        $$('password-rep-input').value = 'qweasdzxc'
        $$('password-input').dispatchEvent(evt)
        $$('password-rep-input').dispatchEvent(evt)
        $$('password-control').style.display = 'none'
        $$('password-rep-control').style.display = 'none'
        localStorage.setItem(constants.LS_BDAY_DAY, day)
        localStorage.setItem(constants.LS_BDAY_MONTH, month)
        localStorage.setItem(constants.LS_BDAY_YEAR, year)
        if (!photo.match(/camera/)) {  // default vk avatar
            let avaContainer = document.querySelector('.avatar')
            avaContainer.setAttribute('src', photo)
            clearAvaChangeOnClick(avaContainer)
            document.getElementById('id_image_url')
                .value = photo
            let vkAvaLoaded = false
            avaContainer.onload = () => {
                if (vkAvaLoaded) return
                imageSize = {
                    width: avaContainer.naturalWidth,
                    height: avaContainer.naturalHeight
                }
                cropper = makeCropper(avaContainer)
                vkAvaLoaded = true
            }
        }
        $$('finish-general-step').click()
        $$('finish-auth-data-step').click()
    }
})();
