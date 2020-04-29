<template>
  <div class="block-page text-center">
      <auth-logo />
      <h3 class="text-white text-bold">Login to Your Hedgehog Account</h3>
      <div class="row">
        <div class="col-xs-12">
          <form @submit="onSubmit">
            <div class="input--akira">
              <FormInput
                v-model="username"
                type="username"
                label="Username"
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
      </div>
      <p :disabled="submitting" :style="{color: 'red', maxWidth: '400px', margin: 'auto'}">{{ allErrors }}</p>
      <p class="text-white"><router-link to="/auth/hedgehog/register">Create a Hedgehog account</router-link></p>
    </div>
</template>

<script>
  import { sha224 } from 'js-sha256'

  import FormInput from '../components/FormInput.vue'
  import { hedgehog } from '../hedgehog'

  const fields = ['username', 'password']

  export default {
    components: { FormInput },
    data() {
      return {
        submitting: false,
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
        this.submitting = true
        try {
          await hedgehog.login(this.username, this.password)
          const wallet = hedgehog.getWallet()
          const response = await this.$http.post('/api/login/', {
            username: this.username,
            password: sha224(wallet.getAddressString())
          }, {
            emulateJSON: true
          })
          if (response.body.errors) {
              throw {status: 404}  // i am sorry
          }
          window.location.href = '/'
        } catch (e) {
          console.error(e)
          if (e.status == 404) {
            this.allErrors = 'Username or password is incorrect'
          } else {
            this.allErrors = e
          }
        }
        this.submitting = false
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
