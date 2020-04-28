import xhr from 'xhr'


const PING_INTERVAL = 60000

setInterval(() => {
    xhr.get(`/chats/ping/`, () => {})
}, PING_INTERVAL)
