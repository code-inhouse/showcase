export default {
  setPlanSettings(state, {planSettings}){
    state.planSettings = planSettings;
  },
  pushEvent(state, {newEvent}){
    state.planSettings.timeslots.push(newEvent)
  },
  editEvent(state, {newEvent}){
    state.planSettings.timeslots = state.planSettings.timeslots.map((timeslot) => {
      if (timeslot.id == newEvent.id) {
        return newEvent
      }
      return timeslot
    })
  },
  deleteEvent(state, {eventId}){
    state.planSettings.timeslots = state.planSettings.timeslots.filter((timeslot) => {
      if (timeslot.id != eventId) {
        return timeslot
      }
    })
  },
  hidePlanSettings(state){
    state.planSettingsVisible = false
  },
  showPlanSettings(state){
    state.planSettingsVisible = true
  },
  setSettings(state, { settings }) {
    state.settings = settings
  },
  setPane(state, { pane }) {
    state.pane = pane
  },
  togglePane(state, { pane }) {
    state.pane = state.pane === pane ? null : pane
  }
}
