import xhr from 'xhr'


export default function init(profile) {
    document.getElementById('like-btn')
        .addEventListener('click', e => {
            let btn = document.getElementById('like-btn')
            if (btn.hasAttribute('disabled')) {
                return
            }
            btn.setAttribute('disabled', true)
            let state = btn.getAttribute('data-state')
            let url = state == 'liked' ?
                      `/likes/unlike/${profile.id}/` :
                      `/likes/like/${profile.id}/`
            xhr.post(url, {
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                }
            }, (err, response, body) => {
                if (!err) {
                    let newState = state == 'liked' ? 'notLiked' : 'liked'
                    btn.setAttribute('data-state', newState)
                    btn.querySelector('span')
                        .textContent = newState == 'liked' ?
                                       __('Убрать лайк') :
                                       __('Поставить лайк')
                    btn.removeAttribute('disabled')
                }
            })
        }
    )
}
