<template lang="html">
  <div class="plan-popup" @click.self="hidePopup">
    <div class="plan-popup__content">
    <div class="plan-popup__wrapper">
      <a-form
        :form="form"
        ref="planForm"
        @submit="handleSubmit"
      >
        <div>
          <a-form-item label="Plan Name" class="plan-popup__name-label">
            <a-input
              :disabled="!isEditable"
              v-decorator="[
                'name',
                {rules: [{required: true, message: 'Name is required'}, {max:199, message: 'Name should be shorter'}]}
              ]"
            />
          </a-form-item>
        </div>
        <a-form-item label="Destination">
          <a-select
            :readonly="type === 'clone' || !isEditable"
            :disabled="type === 'clone' || !isEditable"
            showSearch
            :value="selectedCityId"
            :defaultActiveFirstOption="false"
            :showArrow="false"
            :filterOption="false"
            @search="handleSearch"
            @change="handleChange"
            :notFoundContent="null">
            <a-select-option v-for="city in cities" :key="city.id">
              {{city.display_name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-row :gutter="32">
          <a-col :span="12">
            <a-form-item
              label="Start"
              :validateStatus="startDateErr && 'error'"
              :help="startDateErr"
            >
              <a-date-picker
                :readonly="!isEditable"
                :disabled="!isEditable"
                :value="startDate"
                @change="onStartDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="Duration"
              class="plan-popup__duration-input"
              :validateStatus="durationErr && 'error'"
              :help="durationErr">
              <a-input
                :readonly="type === 'clone' || !isEditable"
                :disabled="type === 'clone' || !isEditable"
                type="number"
                placeholder="days"
                :value="duration"
                @change="onDurationChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="32">
          <a-col :span="12">
            <a-form-item
              label="End"
              :validateStatus="endDateErr && 'error'"
              :help="endDateErr">
              <a-date-picker
                :readonly="type === 'clone' || !isEditable"
                :disabled="type === 'clone' || !isEditable"
                :value="endDate"
                @change="onEndDateChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <Recaptcha v-if="isCreatingNewPlan" ref="recaptcha" />
        <div class="plan-popup__save-btn-desktop-wrapper">
          <button type="button" name="button" class="ant-btn ant-btn-primary" @click="hidePopup"><span>Back</span></button>
          <a-button style="margin: auto; display: block;" type="primary" @click="handleSubmit" v-show="isEditable">
            <span v-if="isCreatingNewPlan">Create Plan</span>
            <span v-else>Save Plan</span>
          </a-button>
        </div>
      </a-form>
      <div class="plan-popup__save-btn-wrapper">
        <button type="button" name="button" class="ant-btn ant-btn-primary" @click="hidePopup"><span>Back</span></button>
        <a-button style="margin: auto; display: block;" type="primary" @click="handleSubmit" v-show="isEditable">
          <span v-if="isCreatingNewPlan">Create Plan</span>
          <span v-else>Save Plan</span>
        </a-button>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {mapGetters} from 'vuex'
import moment from 'moment'

import Recaptcha from './Recaptcha'

const fetchCities = _.debounce((term, cb) => {
  fetch(`/api/cities/?name=${term.trim()}`)
    .then(res => res.json())
    .then(({ results }) => {
      cb(results)
    })
}, 500, { trailing: true })

export default {
  components: { Recaptcha },
  props: {
    type: {
      type: String,
      default: 'create'
    },
    initialCity: {
      type: Object,
      default: null
    }
  },
  data(){
    const { initialCity } = this
    const cities = initialCity ? [initialCity] : null
    const selectedCityId = initialCity ? initialCity.id : undefined
    return {
      form: this.$form.createForm(this),
      cities,
      selectedCityId,
      confirmDirty: false,
      startDate: undefined,
      startDateErr: undefined,
      endDate: undefined,
      endDateErr: undefined,
      duration: undefined,
      durationErr: undefined,
    }
  },
  computed: {
    ...mapGetters({
      planSettingsVisible: 'planSettingsVisible',
      planSettings: 'planSettings'
    }),
    isCreatingNewPlan() {
      return ['create', 'clone'].indexOf(this.type) > -1
    },
    isEditable() {
      const canEdit = this.planSettings && this.planSettings.edit_id
      const isCloning = ['clone', 'create'].indexOf(this.type) > -1
      return canEdit || isCloning
    },
  },
  mounted() {
    if (this.$refs.recaptcha) {
      this.$refs.recaptcha.renderCaptcha()
    }
    this.form.setFieldsValue({
      name: this.planSettings.name || '',
      place: this.planSettings.place,
    })
    this.startDate = moment(this.planSettings.start_date)
    this.endDate = moment(this.planSettings.end_date)
    this.duration = this.endDate.clone().diff(this.startDate, 'days') + 1

    if (this.type === 'clone') {
      this.form.setFieldsValue({name: ''})
    }
  },
  methods: {
    createPlan(){
      const data = {
        start_date: this.from,
        end_date: this.to,
        name: this.name,
        place: this.place
      }
      this.$store.dispatch('createPlan', {data});
    },
    handleSearch(term) {
      fetchCities(term, (cities) => {
        this.cities = cities
      })
    },
    handleChange(city) {
      this.selectedCityId = city
    },
    onStartDateChange(date) {
      this.startDate = date
      if (this.duration) {
        this.endDate = this.startDate.clone().add('days', this.duration - 1)
      }
    },
    onEndDateChange(date) {
      this.endDate = date
      if (this.startDate) {
        const duration = this.endDate.clone().diff(this.startDate, 'days')
        this.duration = duration >= 0 ? duration + 1 : undefined
      }
    },
    onDurationChange(e) {
      this.duration = e.target.value
      if (this.startDate) {
        this.endDate = this.startDate.clone().add('days', this.duration - 1)
      }
    },
    handleSubmit(e) {
      if (!this.isEditable) {
        this.$store.commit('hidePlanSettings')
        return
      }
      let action = this.isCreatingNewPlan ? "createPlan" : "updatePlan"
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        if (!this.startDate) {
          this.startDateErr = 'Field is required'
        } else {
          this.startDateErr = undefined
        }
        if (!this.endDate) {
          this.endDateErr = 'Field is required'
        } else {
          this.endDateErr = undefined
        }
        if (this.startDateErr || this.endDateErr) {
          return
        }
        if (this.startDate.diff(this.endDate) > 0) {
          this.endDateErr = 'End date must be after start date'
          return
        } else {
          this.endDateErr = undefined
        }
        if (this.duration > 30) {
          this.durationErr = '30 days max'
          return
        } else {
          this.durationErr = undefined
        }
        new Promise((resolve, reject) => {
          this.$store.dispatch(action, {
            data: {
              start_date: this.startDate.format('YYYY-MM-DD'),
              end_date: this.endDate.format('YYYY-MM-DD'),
              name: values.name,
              place: values.place,
              city_id: this.selectedCityId,
              parent_id: this.type === 'clone' ? this.planSettings.read_id : undefined,
              'g-recaptcha-response': this.$refs.recaptcha && this.$refs.recaptcha.getResponse()
            },
            resolve,
            reject
          })
        }).then(()=>{
          const container = document.querySelector(".calendar__viewport");
          if (container) {
            container.scrollTop = 320;
          }
          this.$refs.recaptcha && this.$refs.recaptcha.renderCaptcha()
          if (this.type === 'clone') {
            this.$emit("hideClone")
          }
        })
        .catch(() => {
          this.$refs.recaptcha && this.$refs.recaptcha.renderCaptcha()
        })
      })
    },
    hidePopup(){
      this.$store.commit('hidePlanSettings')
    },
    onSubmitMobile() {
      this.$refs.planForm.$el.submit()
    }
  },
  watch: {
    planSettings(newValue, oldValue) {
      this.form.setFieldsValue({
        name: newValue.name || '',
        place: newValue.place,
      })
      this.startDate = newValue.start_date
      this.endDate = newValue.end_date
      this.duration = newValue.end_date.clone().diff(newValue.start_date, 'days') + 1
    },
    planSettingsVisible(){
      this.startDate = moment(this.planSettings.start_date)
      this.endDate = moment(this.planSettings.end_date)
      this.form.setFieldsValue({
        name: this.planSettings.name || '',
        place: this.planSettings.place,
      })
      this.duration = this.endDate.clone().diff(this.startDate, 'days') + 1
    }
  }
}
</script>
