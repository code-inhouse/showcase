<template>
  <div class="block-page text-center reset-password">
    <auth-logo />
    <h3 class="text-white text-bold">Reset your Password</h3>
    <div class="row">
      <div class="col-xs-12">
        <form @submit="onSubmit">
          <div class="input--akira">
            <FormInput
              :error="passwordError"
              v-model="password"
              type="password"
              label="Password"
            />
            <FormInput
              :error="password2Error"
              v-model="password2"
              type="password"
              label="Repeat Password"
            />
          </div>
          <input class="form-control text-bold" type="submit" value="reset password">
        </form>
      </div>
    </div>
    <p><a href="login.html">Back to Login</a></p>
  </div>
</template>

<script>
  import FormInput from '../components/FormInput.vue'

  const fields = ['password', 'password2']

  export default {
    props: ['token'],
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
          const response = await this.$http.post('/api/confirm_recovery/', {
            new_password: this.password,
            token: this.token,
          }, {
            emulateJSON: true
          })
          if (response.body.errors) {
            Object.keys(response.body.errors).filter(field => fields.includes(field)).forEach(field => {
              this[this.errorField(field)] = response.body.errors[field][0]
            })
          } else if (!response.body.ok) {
            alert('Link is expired')
          } else {
            window.location.href = '/'
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
        if (this.password != this.password2) {
          this.password2Error = 'Passwords do not match'
          return false
        }
        return true
      }
    }
  }
</script>
