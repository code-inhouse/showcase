export default function (sent) {
    const LOCALE = 'ru-RU'
    const DATE_OPTIONS = {
        month: '2-digit',
        day: '2-digit',
    }
    const TIME_OPTIONS = {
        hour: '2-digit',
        minute: '2-digit'
    }
    const DATETIME_OPTIONS = Object.assign({}, DATE_OPTIONS, TIME_OPTIONS)
    let sentToday = sent.toDateString() ==
                    (new Date()).toDateString()
    if (sentToday) {
        return sent.toLocaleTimeString(LOCALE, TIME_OPTIONS)
    }
    return sent.toLocaleString(LOCALE, DATETIME_OPTIONS)
}
