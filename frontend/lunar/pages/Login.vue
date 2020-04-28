<template>
  <div class="block-page text-center">
      <auth-logo />
      <h3 class="text-white text-bold">Login to Your Account</h3>
      <div class="row">
        <div class="col-xs-6">
          <form @submit="onSubmit">
            <div class="input--akira">
              <FormInput
                v-model="username"
                type="email"
                label="Email"
                :error="usernameError"
              />
              <FormInput
                v-model="password"
                type="password"
                label="Password"
                :error="passwordError"
              />
              <br>
            </div>
            <input :style="{marginTop: 0, width: '200px'}" class="form-control form-control-login text-bold" type="submit" value="Login">
          </form>
        </div>
        <div class="col-xs-6">
          <a href="/login/facebook/" class="facebook-log login-button"><i class="fa fa-facebook" aria-hidden="true"></i>Log in with Facebook</a><br>
          <a href="/login/google-oauth2/" class="google-log login-button"><i class="fa fa-google" aria-hidden="true"></i>Log in with Google</a><br>
          <a href="/login/twitter/" class="twiter-log login-button"><i class="fa fa-twitter" aria-hidden="true"></i>Log in with Twitter</a>
          <router-link to="/auth/hedgehog/login/" class="hedgehog-log login-button"><i class="fa fa-address-book" aria-hidden="true"></i>Log in with Hedgehog</router-link>
        </div>
      </div>
      <p :style="{color: 'red', maxWidth: '400px'}">{{ allErrors }}</p>
      <p class="text-white"><router-link to="/auth/register">Create an Account</router-link></p>
      <p class="text-white"><router-link to="/auth/recover">Forgot password?</router-link></p>
    </div>
</template>

<style>
  .google-log,
  .twiter-log {
    margin-top: 40px;
  }
</style>

<script>
  import FormInput from '../components/FormInput.vue'

  const fields = ['username', 'password']

  export default {
    components: { FormInput },
    data() {
      return {
        allErrors: '',
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
          const response = await this.$http.post('/api/login/', {
            username: this.username,
            password: this.password
          }, {
            emulateJSON: true
          })
          if (response.body.errors) {
            Object.keys(response.body.errors).filter(field => fields.includes(field)).forEach(field => {
              this[this.errorField(field)] = response.body.errors[field][0]
            })
            if (response.body.errors.__all__) {
              this.allErrors = response.body.errors.__all__[0]
            }
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
        return validated
      }
    }

  }
</script>
