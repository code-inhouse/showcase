import Profile from './profile'


export default function init(profile) {
  let slider = document.getElementById('age-search-slider')
    noUiSlider.create(slider, {
        start: [profile.lookingFor.age.from, profile.lookingFor.age.to],
        step: 1,
        connect: true,
        tooltips: true,
        format: wNumb({
            decimals: 0
        }),
        range: {
            'min': [18],
            '80%': [60],
            'max': [100]
        }
    })
    slider.noUiSlider.on('slide', () => {
        let [lower, upper] = slider.noUiSlider.get()
        document.getElementById('lower-age-bound').value = lower
        document.getElementById('upper-age-bound').value = upper
    })
    document.getElementById('toggle-update-search-options')
        .addEventListener('click' , () => {
            let form = document.getElementById('update-search-options')
            if (form.hasAttribute('hidden')) {
                form.removeAttribute('hidden')
            } else {
                form.setAttribute('hidden', true)
            }
        }
    )
    document.getElementById('toggle-update-char-options')
        .addEventListener('click', () => {
            let form = document.getElementById('update-char-options')
            if (form.hasAttribute('hidden')) {
                form.removeAttribute('hidden')
            } else {
                form.setAttribute('hidden', true)
            }
        }
    )
    let updateCharForm = $('#update-char-options')
    $('#update-character-button').click(function() {
        $.post(updateCharForm.attr('action'),
               updateCharForm.serialize(),
               function(data) {
                   PROFILE_CONFIG.bodyType = data.bodyType
                   PROFILE_CONFIG.attitudes = data.attitudes
                   initDescription(new Profile(PROFILE_CONFIG))
                   updateCharForm.attr('hidden', true)
               }
        ).fail(function() {
            alert(__('Произошла ошибка, обновите страницу и попробуйте снова.'))
        })
    })
    let updateLookingForForm = $('#update-search-options')
    $('#update-looking-for-button').click(function() {
        $.post(updateLookingForForm.attr('action'),
               updateLookingForForm.serialize(),
               function(data) {
                   PROFILE_CONFIG.lookingFor = data.lookingFor
                   PROFILE_CONFIG.purpose = data.purpose
                   initDescription(new Profile(PROFILE_CONFIG))
                   updateLookingForForm.attr('hidden', true)
               }
        ).fail(function() {
            alert(__('Произошла ошибка, обновите страницу и попробуйте снова.'))
        })
    })
    initNameChangeControls(profile)
}

function initNameChangeControls(profile) {
  let name = profile.name
  let $input = $('#change-name-input')
  let $nameForm = $('.change-name-form')
  let $nameBlock = $('.name-block')
  let $triggerBtn = $('#trigger-name-change-btn')
  let $confirmBtn = $('#confirm-name-change-btn')
  let $cancelBtn = $('#cancel-name-change-btn')
  $triggerBtn.click(e => {
    $input.val(name)
    $nameForm.removeAttr('hidden')
    $nameBlock.attr('hidden', true)
    $input.focus()
  })
  $input.on('input', e => {
    if (e.target.value.length < 2) {
      $confirmBtn.hide()
    } else {
      $confirmBtn.show()
    }
  })
  $cancelBtn.click(e => {
    $nameForm.attr('hidden', true)
    $nameBlock.removeAttr('hidden')
  })
  $confirmBtn.click(e => {
    name = $input.val()
    $('.profile-like__name').text(name)
    $nameForm.attr('hidden', true)
    $nameBlock.removeAttr('hidden')
    $.post('/profile/name/', JSON.stringify({name}), res => {
      console.log(res)
    })
  })
}


export function initDescription(profile) {
    document.getElementById('age')
        .textContent = profile.russianAge
    document.getElementById('about-me')
        .textContent = profile.selfDescription
    document.getElementById('looking-for')
        .textContent = profile.lookingForDescription
}
