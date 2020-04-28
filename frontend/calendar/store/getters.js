export default {
  pane: state => state.pane,
  planSettings: state => state.planSettings,
  planSettingsVisible: state => state.planSettingsVisible,
  settings: state => state.settings,
  events: (state) => {
    if (!state.planSettings.timeslots) return []
    let arr = state.planSettings.timeslots.map((timeslot) => {
      let d = new Date(timeslot.date)
      d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
      let start = new Date(d)
          start = new Date(start.setHours(timeslot.hour))
          start = new Date(start.setMinutes(timeslot.minute))
      let end = new Date(start.getTime() + timeslot.duration * 60000)
      let title = timeslot.name
      let color = timeslot.color

      start = formatDateForEvent(start)
      end = formatDateForEvent(end)

      return {start, end, title, class: color, description: timeslot.description, eventId:timeslot.id}
    })

    return arr
  }
}

function leftPad(val) {
  let string = `${val}`
  if (string.length > 1) {
    return string
  }
  return `0${string}`
}

function formatDateForEvent(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hours = d.getHours(),
        minutes = d.getMinutes()

    const res = [leftPad(year), leftPad(month), leftPad(day)].join('-') + ' ' + leftPad(hours) + ':' + leftPad(minutes)
    return res;
}
