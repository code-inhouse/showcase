<template>
  <div class="panel panel-cryptic element-box-shadow">
    <div class="panel-heading padding_30">
      <h3 class="no-margin">Personal details</h3>
    </div>
    <div class="panel-body padding_30">
      <form class="form-horizontal" @submit="onSubmit">
        <fieldset>
          <FormInput
            v-model="firstName"
            placeholder="First Name"
            label="First Name"
          />
          <FormInput
            v-model="lastName"
            placeholder="Last Name"
            label="Last Name"
          />
          <FormInput
            v-model="email"
            :disabled="true"
            placeholder="Email"
            label="Email"
            type="email"
          />
          <FormInput
            v-model="phone"
            placeholder="0088 4455 1189"
            label="Phone Number"
            type="text"
          />
          <button class="btn btn-cryptic button-element sweetalert31" type="submit">Save</button>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<script>
  import FormInput from './FormInput.vue'

  export default {
    components: { FormInput },
    props: [
      'initialFirstName',
      'initialLastName',
      'initialEmail',
      'initialPhone',
    ],
    data() {
      return {
        firstName: this.initialFirstName,
        lastName: this.initialLastName,
        email: this.initialEmail,
        phone: this.initialPhone,
      }
    },
    methods: {
      async onSubmit(e) {
        e.preventDefault()
        try {
          await this.$http.post('/api/update_personal_data/', {
            first_name: this.firstName,
            last_name: this.lastName,
            phone_number: this.phone
          }, {
            emulateJSON: true
          })
          this.$notify({
            title: 'Saved',
            type: 'success',
          })
        } catch (exc) {
          this.$notify({
            title: 'Error saving data',
            type: 'error'
          })
        }
      }
    }
  }
</script>
