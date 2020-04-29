import 'whatwg-fetch'

export default {
    createPlan({commit, state}, {data, resolve, reject = () => {}}) {
      fetch('/api/plans/', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
              'Content-Type': 'application/json'
          }
      }).then((res) => {
        if (res.ok) {
           return res.json();
         } else {
           throw res;
         }
      }).then((data) => {
        commit('setPlanSettings', {planSettings: data});
        commit('hidePlanSettings');
        if (resolve) {
          resolve()
        }
        history.pushState(null, null, `/edit/${data.edit_id}`);
      }).catch((err) => {
        alert("validation error")
        reject(err)
      })
    },

    updatePlan({commit, state}, {data, resolve}) {
      fetch(`/api/plans/${state.planSettings.id}/`, {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
              'X-EditId': state.planSettings.edit_id,
              'Content-Type': 'application/json'
          }
      }).then((res) => {
        if (res.ok) {
           return res.json();
         } else {
           throw new Error(res);
         }
      }).then((data) => {
        commit('setPlanSettings', {planSettings: data});
        commit('hidePlanSettings', {planSettings: data});
        resolve()
      }).catch((err) => {
        alert("validation error")
        console.log(err)
      })
    },

    checkPlanID({commit, state}, {editId, resolve}) {
      fetch(`/api/plans/${editId}/`).then((res) => {
        if (res.ok) {
           return res.json();
         } else {
           throw new Error(res);
         }
      }).then((data) => {
        commit('setPlanSettings', {planSettings: data});
        resolve()
      }).catch((err) => {
        console.log(err);
        if (window.location.pathname != "/") {
          document.location.href="/";
        }
      })
    },

    addEvent({commit, state}, {planId, editId, eventObj, resolve}) {
      fetch(`/api/timeslots/`, {
          method: 'POST',
          body: JSON.stringify({
              plan: planId,
              name: eventObj.title,
              color: eventObj.color,
              description: eventObj.description,
              hour: eventObj.start.getHours(),
              minute: eventObj.start.getMinutes(),
              duration: Math.floor((Math.abs(eventObj.start - eventObj.end)/1000)/60),
              date: formatDate(eventObj.start)
          }),
          headers: {
              'X-EditId': editId,
              'Content-Type': 'application/json',
          },
      })
      .then((res) => {
        if (res.ok) {
           return res.json();
         } else {
           throw new Error(res);
         }
      }).then((data) => {
        commit('pushEvent', {newEvent: data});
        resolve()
      }).catch((err) => {
        console.log(err);
        resolve()
      })
    },

    updateEvent({commit, state}, {planId, eventId, editId, eventObj, resolve}) {
      fetch(`/api/timeslots/${eventId}/`, {
          method: 'PUT',
          body: JSON.stringify({
              plan: planId,
              name: eventObj.title,
              color: eventObj.color,
              description: eventObj.description,
              hour: eventObj.start.getHours(),
              minute: eventObj.start.getMinutes(),
              duration: Math.floor((Math.abs(eventObj.start - eventObj.end)/1000)/60),
              date: formatDate(eventObj.start)
          }),
          headers: {
              'X-EditId': editId,
              'Content-Type': 'application/json',
          },
      })
      .then((res) => {
        if (res.ok) {
           return res.json();
         } else {
           throw new Error(res);
         }
      }).then((data) => {
        commit('editEvent', {newEvent: data});
        resolve()
      }).catch((err) => {
        console.log(err);
        resolve()
      })
    },

    deleteEvent({commit, state}, {eventId, editId, resolve}) {
      fetch(`/api/timeslots/${eventId}/`, {
          method: 'DELETE',
          headers: {
              'X-EditId': editId,
              'Content-Type': 'application/json',
          },
      })
      .then((res) => {
        if (res.ok) {
           return res
         } else {
           throw new Error(res);
         }
      }).then((data) => {
        commit('deleteEvent', {eventId});
        resolve()
      }).catch((err) => {
        console.log(err);
        resolve()
      })
    },

    fetchSettings({ commit }) {
      fetch('/api/settings/').then(res => res.json()).then((settings) => {
        commit('setSettings', { settings })
      })
    }
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
