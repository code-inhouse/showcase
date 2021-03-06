<template lang="pug">
.vuecal__flex.vuecal__weekdays-headings
  .vuecal__flex.vuecal__heading(
    :class="{ today: heading.today }"
    v-for="(heading, i) in headings"
    :key="i"
    :style="weekdayCellStyles")
    transition(:name="`slide-fade--${transitions.direction}`" :appear="transitions.active" v-if="heading.customFull == 'last'")
      span#heading-last.heading-last(@click="simulateClick()") <a-icon type="plus" /> Add days
    transition(v-else :name="`slide-fade--${transitions.direction}`" :appear="transitions.active")
      span(:key="transitions.active ? `${i}-${heading.date}` : false")
        //- For small/xsmall option. 3 media queries also truncate weekdays.
        span.custom-full {{heading.customFull}}
        span.custom-medium {{heading.customMedium}}
        span.custom-small {{heading.customSmall}}
        //- span.full {{ heading.full }}
        //- span.small {{ heading.small }}
        //- span.xsmall {{ heading.xsmall }}
        //- span(v-if="heading.date") {{ heading.date }}
  span#right-hours
</template>

<script>
import { isDateToday } from './date-utils'

export default {
  props: {
    view: {
      type: Object,
      default: () => ({})
    },
    minCellWidth: {
      type: Number,
      default: 0
    },
    transitions: {
      type: Object,
      default: () => ({ active: true, direction: 'right' })
    },
    weekDays: {
      type: Array,
      default: () => []
    },
    isPlan: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    startPlanDate: {
      type: [String, Date],
      default: ''
    },
    // Will override default truncation of weekDays if this is defined in i18n file.
    weekDaysShort: {
      type: [Array, null],
      default: () => []
    }
  },
  methods: {
    simulateClick(){
      document.getElementById('plan-settings').click()
    }
  },
  computed: {
    headings () {
      let headings = []

      switch (this.view.id) {
        case 'month':
        case 'week':
          let todayFound = false
          headings = this.weekDays.map((cell, i) => {
            let d = new Date(this.startPlanDate)
            d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
            const date = this.isPlan ? d.addDays(i) : this.view.startDate.addDays(i)
            return {
              full: cell.label,
              // If defined in i18n file, weekDaysShort overrides default truncation of
              // week days when does not fit on screen or with small/xsmall options.
              small: this.weekDaysShort ? this.weekDaysShort[i].label : cell.label.substr(0, 3),
              xsmall: this.weekDaysShort ? this.weekDaysShort[i].label : cell.label.substr(0, 1),
              customFull: customFull(date, cell.label),
              customMedium: customMedium(date, cell.label),
              customSmall: customSmall(date, cell.label),

              // Only for week view.
              ...(this.view.id === 'week' ? {
                date: customDateFormat(date),
                today: !todayFound && isDateToday(date) && !todayFound++
              } : {})
            }
          })
          break
      }

      if (this.isAdmin) {
        headings.push({customFull: "last"})
      }
      return headings
    },
    weekdayCellStyles () {
      return { minWidth: this.minCellWidth ? `${this.minCellWidth}px` : null }
    }
  }
}

function customDateFormat(date){
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `, ${months[date.getMonth()]} ${date.getDate()}th, ${date.getFullYear()}`
}

function customFull(date){
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${getWeekName(date)}, ${months[date.getMonth()]} ${date.getDate()}`
}

function customMedium(date){
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${getWeekName(date).substr(0, 3)} ${months[date.getMonth()]} ${date.getDate()}`
}

function customSmall(date){
  return `${getWeekName(date).substr(0, 3)} ${date.getDate()}`
}

function getWeekName(date){
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}
</script>

<style lang="scss">
$time-column-width: 3em;
$time-column-width-12: 4em; // 12-hour clock shows am/pm.
$weekdays-headings-height: 2.8em;

.vuecal {
  &__weekdays-headings {
    border-bottom: 1px solid #ddd;
    margin-bottom: -1px;

    .vuecal--view-with-time & {
      padding-left: $time-column-width;
    }

    .vuecal--view-with-time.vuecal--time-12-hour & {
      font-size: 0.9em;
      padding-left: $time-column-width-12;
    }

    .vuecal--split-days.vuecal--view-with-time & {
      padding-left: 0;
    }
  }

  &__heading {
    width: 100%;
    height: $weekdays-headings-height;
    font-weight: 400;
    justify-content: center;
    text-align: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    .vuecal--month-view &, .vuecal--week-view &, .vuecal--day-view & {width: 14.2857%;}
    .vuecal--hide-weekends.vuecal--month-view &,
    .vuecal--hide-weekends.vuecal--week-view &,
    .vuecal--hide-weekends.vuecal--day-view & {width: 20%;}
    .vuecal--years-view & {width: 20%;}
    .vuecal--year-view & {width: 33.33%;}

    & > span {flex-shrink: 0;display: flex;}

    .vuecal--small & .small, .vuecal--xsmall & .xsmall {display: block;}
    .small, .xsmall,
    .vuecal--small & .full, .vuecal--small & .xsmall,
    .vuecal--xsmall & .full, .vuecal--xsmall & .small {display: none;}
  }
}

// Media queries.
//==================================//
@media screen and(max-width: 550px) {
  .vuecal__heading {
    line-height: 1.2;

    .small,
    .vuecal--small & .small,
    .vuecal--xsmall & .xsmall {display: block;}
    .full, .xsmall,
    .vuecal--small & .full, .vuecal--small & .xsmall,
    .vuecal--xsmall & .full, .vuecal--xsmall & .small {display: none;}

    .vuecal--overflow-x & .full,
    .vuecal--small.vuecal--overflow-x & .small,
    .vuecal--xsmall.vuecal--overflow-x & .xsmall {display: block;}
    .vuecal--overflow-x & .small, .vuecal--overflow-x & .xsmall,
    .vuecal--small.vuecal--overflow-x & .full, .vuecal--small.vuecal--overflow-x & .xsmall,
    .vuecal--xsmall.vuecal--overflow-x & .full, .vuecal--xsmall.vuecal--overflow-x & .small {display: none;}
  }
}

@media screen and(max-width: 450px) {
  .vuecal__heading {
    .xsmall,
    .vuecal--small & .xsmall,
    .vuecal--xsmall & .xsmall {display: block;}
    .full, .small,
    .vuecal--small & .full, .vuecal--small & .small,
    .vuecal--xsmall & .full, .vuecal--xsmall & .small {display: none;}

    .vuecal--small.vuecal--overflow-x & .small,
    .vuecal--xsmall.vuecal--overflow-x & .xsmall {display: block;}
    .vuecal--small.vuecal--overflow-x & .full, .vuecal--small.vuecal--overflow-x & .xsmall,
    .vuecal--xsmall.vuecal--overflow-x & .full, .vuecal--xsmall.vuecal--overflow-x & .small {display: none;}
  }
}
</style>
