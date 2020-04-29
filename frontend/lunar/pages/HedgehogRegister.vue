<template>
  <div class="hedgehog-form block-page text-center">
    <auth-logo />
    <h3 class="text-white text-bold">Register via Hedgehog</h3>
    <div class="spacer_10"></div>
    <form @submit="onSubmit">
      <div class="row">
        <FormInput :error="usernameError" type="text" label="Username" v-model="username" />
        <FormInput :error="passwordError" type="password" label="Password" v-model="password" />
        <FormInput :error="password2Error" type="password" label="Repeat password" v-model="password2" />
      </div>
      <p>* Hedgehog passwords cannot be restored</p>
      <div :class="{'register-check': true, 'terms--input__shake': termsError}">
        <input v-model="terms" type="checkbox" id="c1" name="terms" value="terms">
        <label for="c1" class="text-white"><span></span>Accept terms &amp; conditions</label>
      </div>
      <input :disabled="submitting" class="form-control text-bold" type="submit" value="create an account">
    </form>
    <p class="text-white">or <router-link to="/auth/hedgehog/login" class="text-bold">Login via Hedgehog</router-link></p>
  </div>
</template>

<style>
  .register-check {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .hedgehog-form .input__error {
    left: 41%;
  }

  @keyframes shake {
    from {
      margin-left: 0;
    }

    33% {
      margin-left: -10px;
    }

    66% {
      margin-left: 10px;
    }

    100% {
      margin-left: 0;
    }
  }


  .register-check > label {
    width: auto;
    margin-left: 12px;
  }

  .terms--input__shake {
    animation-duration: 1s;
    animation-name: shake;
  }

</style>

<script>
  import { hedgehog } from '../hedgehog'
  import FormInput from '../components/FormInput.vue'

  const fields = ['password', 'password2', 'username']

  export default {
    events: ['register'],
    components: { FormInput },
    data() {
      return {
        submitting: false,
        terms: false,
        termsError: false,
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
          await hedgehog.signUp(this.username, this.password)
          window.location.href = '/'
        } catch (e) {
          console.error(e)
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
        if (!validated) {
          return false
        }
        if (!this.terms) {
          this.termsError = true
          setTimeout(() => this.termsError = false, 1500)
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
