<template>
  <div class="datetimepicker">
    <a-date-picker
      placeholder="Date"
      class="datetimepicker__date"
      :value="startDate"
      label="ola"
      @change="onDateChange"
    />
    <a-select
      placeholder="Start"
      class="datetimepicker__hour datetimepicker__hour-start"
      @change="onStartHourChange"
      :value="startHour"
    >
      <a-select-option v-for="value in values" :key="value" :value="value">{{ toHuman(value) }}</a-select-option>
    </a-select>
    <a-select
      placeholder="End"
      class="datetimepicker__hour datetimepicker__hour-end"
      @change="onEndHourChange"
      :value="endHour"
    >
      <a-select-option v-for="value in values" :key="value" :value="value">{{ toHuman(value) }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
  export default {
    props: ['startDate', 'endDate', 'onChange'],
    data() {
      return {
        values: new Array(48).fill(null).map((_, i) => i / 2)
      }
    },
    methods: {
      toHuman(value) {
        const hour = Math.floor(value)
        const suffix = value === Math.floor(value) ? '00' : '30'
        const prefix = `${hour}`.length == 1 ? '0' : '';
        return `${prefix}${hour}:${suffix}`
      },
      onDateChange(startDate) {
        this.propagateChange(startDate, this.startHour, this.endHour)
      },
      onStartHourChange(startHour) {
        this.propagateChange(this.startDate, startHour, this.endHour)
      },
      onEndHourChange(endHour) {
        this.propagateChange(this.startDate, this.startHour, endHour)
      },
      propagateChange(date, startHour, endHour) {
        const startDate = date.clone().hours(Math.floor(startHour)).minutes(Math.floor(startHour) == startHour ? 0 : 30)
        const endDate = date.clone().hours(Math.floor(endHour)).minutes(Math.floor(endHour) == endHour ? 0 : 30)
        this.onChange([startDate, endDate])
      }
    },
    computed: {
      startHour() {
        return this.startDate.hour() + (this.startDate.minutes() === 30 ? 0.5 : 0)
      },
      endHour() {
        return this.endDate.hour() + (this.endDate.minutes() === 30 ? 0.5 : 0)
      }
    }
  }
</script>
