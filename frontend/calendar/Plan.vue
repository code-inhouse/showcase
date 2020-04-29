<template lang="html">
  <div class="calendar-wrapper" :class="{viewer: !planSettings.edit_id, 'event-open': this.pane === 'addEvent', 'discuss-open': this.pane === 'discuss', 'share-open': this.pane === 'share'}">
    <div class="calendar-header">
      <div class="calendar-header__timezone-name">
        {{timezone}}
      </div>
      <div class="calendar-header__wrapper">
        <div class="calendar-header__details">
          <h1 id="plan-settings" @click="showPlanSettings">{{planSettings.name}}</h1>
          <!-- <p>{{planSettings.start_date | headerDateFormat}} to {{planSettings.end_date | headerDateFormat}} <span v-if="planSettings.place">in {{planSettings.place}}</span></p> -->
        </div>
        <div class="calendar-header__right">
          <p v-if="planSettings.city" class="calendar-header__destination">
            {{ planSettings.city.name }}
          </p>
          <div class="calendar-header__buttons">
            <a-button type="primary" @click="showSharePopup" v-bind:class="{ 'pane__button--active': pane === 'share' }"><a-icon type="share-alt" /><span>Share</span></a-button>
            <a-button type="primary" @click="showDiscuss" v-bind:class="{ 'pane__button--active': pane === 'discuss' }"><a-icon type="message" /><span>Discuss</span></a-button>
          </div>
          <PlanSettings v-show="planSettingsVisible" type="update" :initialCity="planSettings ? planSettings.city : null"/>
        </div>
      </div>
      <div v-show="pane === 'addEvent'" class="add-new-event">
        <a-icon @click="hidePopup" type="close" />
        <!-- <h2 v-show="planSettings.edit_id" v-else>{{currentEvent.title}}</h2> -->
        <div v-show="!planSettings.edit_id" class="event-popup-view">
          <h2>{{currentEvent.title}}</h2>
          <p class="event-popup-view__date">{{currentEvent.startDate | weekDay}}, {{currentEvent.startDate | popupDateFormat}} <span>⋅</span> {{currentEvent.startDate | timeFormat}} – {{currentEvent.endDate | timeFormat}}</p>
          <div class="date-label" v-if="currentEvent.description">
            <label class="date-label__start">Notes</label>
          </div>
          <p class="event-popup-view__description">{{currentEvent.description}}</p>
        </div>
        <a-form v-show="planSettings.edit_id" :form="form" @submit="handleSubmit">
          <a-form-item class="add-new-event__name">
            <a-input placeholder="Event Name"
              v-decorator="[ 'title',
                {rules: [{required: true, message: 'Name is required'}]}]"/>
          </a-form-item>
          <div class="date-label date-label--date-time-picker">
            <label class="date-label__start-date">Date</label>
            <label class="date-label__start-time">Start</label>
            <label class="date-label__end-time">End</label>
          </div>
          <DateTimePicker
            :startDate="dates && dates[0]"
            :endDate="dates && dates[1]"
            :onChange="onDatesChange"
          />
          <a-form-item>
          <a-form-item class="add-new-event__notes">
            <div class="date-label">
              <label class="date-label__start">Notes</label>
            </div>
            <a-textarea v-decorator="['description',
                {rules: [{required: false}]}]"/>
          </a-form-item>
          <div class="add-new-event__buttons">
            <a-icon @click="deleteEvent" type="delete" />
            <a-form-item class="color-dropdown" label="Color">
              <a-select v-decorator="['color',{initialValue:'grey'}]">
                <a-select-option value="grey" class="grey"><span class="custom-input grey"></span></a-select-option>
                <a-select-option value="red" class="red"><span class="custom-input red"></span></a-select-option>
                <a-select-option value="yellow" class="yellow"><span class="custom-input yellow"></span></a-select-option>
                <a-select-option value="green" class="green"><span class="custom-input green"></span></a-select-option>
                <a-select-option value="blue" class="blue"><span class="custom-input blue"></span></a-select-option>
                <a-select-option value="purple" class="purple"><span class="custom-input purple"></span></a-select-option>
              </a-select>
            </a-form-item>
            <a-button v-if="createEvent" class="right" type="primary" html-type="submit">Save</a-button>
            <a-button v-else class="right" type="primary" html-type="submit">Save</a-button>
          </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div id="planer" class="calendar calendar__custom" :class="calendarDaysClass" :key="planSettings.end_date">
      <calendar :class="{'event-open': this.pane === 'addEvent'}"
                :disable-views="['years', 'year', 'month', 'day']"
                :hideViewSelector="true"
                :hideTitleBar="true"
                :timeStep="60"
                :isPlan="true"
                :isAdmin="isAdmin"
                :startPlanDate="planSettings.start_date"
                :timezoneName="planTimezone"
                :endPlanDate="planSettings.end_date"
                :onEventClick="eventClick"
                :events="events"
                @add-event="addEvent">
      </calendar>
    </div>
    <Discuss :style="{ display: this.pane === 'discuss' ? 'block' : 'none' }" />
    <Share v-if="this.pane === 'share'" />
  </div>
</template>

<script>
import VueCal from './vue-cal/index.vue'
import moment from 'moment-timezone'
import {mapGetters} from 'vuex';
import PlanSettings from './PlanSettings.vue'
import Discuss from './Discuss.vue';
import Share from './Share.vue';
import DateTimePicker from './DateTimePicker'

export default {
  data(){
    return {
      buttonPosition: {
        top: '0px',
        left: '0px'
      },
      form: this.$form.createForm(this),
      visibleEventButton: false,
      mouseIsAboveEvent: false,
      currentTime: '00:00',
      dates: null,
      visibleShare: false,
      createEvent: false,
      copyReadLink: false,
      copyEditLink: false,
      copyCloneLink: false,
      currentEvent: {}
    }
  },
  filters: {
    headerDateFormat: function (dateString) {
      let date = new Date(dateString)
      date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 );
      const month = date.toLocaleString('en-us', { month: 'long' });
      return `${month} ${date.getDate()}th`
    },
    popupDateFormat: function (dateString) {
      return `${moment(dateString).format('MMMM')} ${moment(dateString).format('D')}th`
    },
    weekDay: function (dateString) {
      return moment(dateString).format('dddd')
    },
    timeFormat: function (dateString) {
      return moment(dateString).format('HH:mm');
    }
  },
  computed: {
    ...mapGetters({
      planSettings: 'planSettings',
      planSettingsVisible: 'planSettingsVisible',
      events: 'events',
      pane: 'pane',
    }),
    isAdmin(){
      if (this.planSettings.edit_id) {
        return true
      } else {
        return false
      }
    },
    cloneLink(){
      return `${window.location.origin}/clone/${this.planSettings.read_id}`
    },
    calendarDaysClass(){
      return "d-" + this.planSettings.days.length
    },
    planTimezone(){
      if (this.planSettings.city && this.planSettings.city.timezone) {
        return moment.tz(new Date(), this.planSettings.city.timezone).format('MM/DD/YYYY HH:mm:ss')
      }

      return false
    },
    timezone(){
      if (this.planSettings.city && this.planSettings.city.timezone) {
        return moment().tz(this.planSettings.city.timezone).zoneAbbr()
      }

      return ""
    }
  },
  components: {
    calendar: VueCal,
    PlanSettings: PlanSettings,
    Discuss,
    Share,
    DateTimePicker,
  },
  methods: {
    showDiscuss(e){
      e.stopPropagation()
      e.target.blur()
      this.$store.commit('togglePane', { pane: 'discuss' })
    },
    eventClick(e){
      this.form.setFieldsValue({
        title: e.title,
        color: e.class,
        description: e.description
      })

      this.dates = [new moment(e.start.replace(' ', 'T')), new moment(e.end.replace(' ', 'T'))]

      this.currentEvent.startDate = e.start
      this.currentEvent.endDate = e.end
      this.currentEvent.title = e.title
      this.currentEvent.color = e.class
      this.currentEvent.description = e.description

      this.eventId = e.eventId
      this.createEvent = false
      this.$store.commit('setPane', { pane: 'addEvent' })
    },
    addEvent(obj){
      let startEventTime = new Date(obj.date.setHours(obj.time.slice(0, 2),obj.time.slice(3, 5),0,0))
      let endEventTime = new Date(startEventTime.getTime() + 60 * 60000)
      this.dates = [startEventTime, endEventTime].map(x => new moment(x, "YYYY-MM-DD HH:mm"))
      this.form.setFieldsValue({
        color: "grey",
        title: "",
        description: ""
      })

      this.createEvent = true
      if (document.querySelector('.vuecal__event--focus')) {
        document.querySelector('.vuecal__event--focus').classList.remove('vuecal__event--focus');
      }
      this.$store.commit('setPane', { pane: 'addEvent' })
    },
    hidePopup(){
      if (document.querySelector('.vuecal__event--focus')) {
        document.querySelector('.vuecal__event--focus').classList.remove('vuecal__event--focus');
      }
      this.$store.commit('setPane', { pane: null })
    },
    handleSubmit(e) {
      let action = this.createEvent ? "addEvent" : "updateEvent"
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        let eventObj = {
          start: this.dates[0].toDate(),
          end: this.dates[1].toDate(),
          title: values.title,
          color: values.color,
          description: values.description
        }

        new Promise((resolve) => {
          if (this.createEvent){
            this.$store.dispatch(action, {planId: this.planSettings.id, editId: this.planSettings.edit_id, eventObj, resolve});
          } else {
            this.$store.dispatch(action, {planId: this.planSettings.id, eventId: this.eventId, editId: this.planSettings.edit_id, eventObj, resolve});
          }
        }).then(this.hidePopup())
      })
    },
    onDatesChange(dates) {
      this.dates = dates;
    },
    deleteEvent(){
      new Promise((resolve) => {
        this.$store.dispatch("deleteEvent", {eventId: this.eventId, editId: this.planSettings.edit_id, resolve});
      }).then(this.hidePopup())
    },
    showPlanSettings(){
      this.$store.commit('showPlanSettings')
      this.hidePopup()
    },
    showSharePopup(){
      this.$store.commit('togglePane', { pane: 'share' })
      this.visibleShare = true
    },
    copyReadSucess(){
      this.copyReadLink = true
      setTimeout(() => {
        this.copyReadLink = false
      }, 900)
    },
    copyEditSucess(){
      this.copyEditLink = true
      setTimeout(() => {
        this.copyEditLink = false
      }, 900)
    },
    copyCloneSucess(){
      this.copyCloneLink = true
      setTimeout(() => {
        this.copyCloneLink = false
      }, 900)
    },
    validateEventDates(rule, value, cb) {
      const startDate = moment(this.planSettings.start_date)
      const endDate = moment(this.planSettings.end_date).add(1, 'day')  // end of the day
      const [eventStart, eventEnd] = value
      if (eventStart.diff(startDate) < 0) {
        return cb('Event cannot start before the plan start')
      }
      if (eventEnd.diff(endDate) > 0) {
        return cb('Event cannot start after the plan ends')
      }
      cb()
    }
  },
  mounted(){
    const container = document.querySelector(".calendar__viewport");
    container.scrollTop = 320;

    if (this.planSettings.city) {
      window.document.title = `Itinerio: ${this.planSettings.name} (${formatTitleDate(this.planSettings.start_date)} - ${formatTitleDate(this.planSettings.end_date)}, ${this.planSettings.city.display_name})`
    } else {
      window.document.title = `Itinerio: ${this.planSettings.name} (${formatTitleDate(this.planSettings.start_date)} - ${formatTitleDate(this.planSettings.end_date)})`
    }
  }
}

function formatTitleDate(dateString){
  let date = new Date(dateString)
  date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 );
  const month = date.toLocaleString('en-us', { month: 'long' });
  return `${month} ${date.getDate()}`
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
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
</script>
