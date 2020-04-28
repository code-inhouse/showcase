<template>
  <div class="block-page text-center">
    <auth-logo />
    <h3 class="text-white text-bold">Reset Your Password</h3>
    <form @submit="onSubmit">
      <FormInput
        :error="emailError"
        type="email"
        label="Email"
        v-model="email"
      />
      <input class="form-control text-bold" type="submit" value="recover now">
    </form>
    <p><router-link href="/auth/login">Back to Login</router-link></p>
  </div>
</template>

<script>
  import FormInput from './FormInput.vue'

  const fields = ['email']

  export default {
    components: { FormInput },
    data() {
      return {
        ...fields.reduce((obj, field) => ({
          [field]: '',
          [this.errorField(field)]: '',
          ...obj
        }), {})
      }
    },
    methods: {
      async onSubmit(e) {
        e.preventDefault()
        if (!this.validate()) {
          return
        }
        try {
          const response = await this.$http.post('/api/request_recovery/', {
            email: this.email,
          }, {
            emulateJSON: true
          })
          if (response.body.errors) {
            Object.keys(response.body.errors).filter(field => fields.includes(field)).forEach(field => {
              this[this.errorField(field)] = response.body.errors[field][0]
            })
          } else if (!response.body.ok) {
            this[this.errorField('email')] = 'User does not exist'
          } else {
            this.$emit('done', this.email)
          }
        } catch (e) {
          console.error(e)
        }
      },

      errorField(field) {
        return `${field}Error`
      },

      validate() {
        let validated = true
        for (let field of fields) {
          if (!this[field].trim()) {
            validated = false
            this[this.errorField(field)] = 'Field is required'
          }
        }
        if (!validated) {
          return false
        }
        return true
      }
    }
  }
</script>
