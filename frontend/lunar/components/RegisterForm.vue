<template>
  <div class="block-page text-center">
    <auth-logo />
    <h3 class="text-white text-bold">Register</h3>
    <div class="spacer_10"></div>
    <form @submit="onSubmit">
      <div class="row">
        <div class="col-xs-6">
          <FormInput :error="nameError" type="text" label="Name" v-model="name" />
          <FormInput :error="emailError" type="email" label="Email" v-model="email" />
        </div>
        <div class="col-xs-6">
          <FormInput :error="passwordError" type="password" label="Password" v-model="password" />
          <FormInput :error="password2Error" type="password" label="Repeat password" v-model="password2" />
        </div>
      </div>
      <div :class="{'register-check': true, 'terms--input__shake': termsError}">
        <input v-model="terms" type="checkbox" id="c1" name="terms" value="terms">
        <label for="c1" class="text-white"><span></span>Accept terms &amp; conditions</label>
      </div>
      <input class="form-control text-bold" type="submit" value="create an account">
    </form>
    <p class="text-white">or <router-link to="/auth/login" class="text-bold">Login</router-link></p>
  </div>
</template>

<style>
  .register-check {
    display: flex;
    justify-content: center;
    width: 100%;
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
  import FormInput from './FormInput.vue'

  const fields = ['email', 'password', 'password2', 'name']

  export default {
    events: ['register'],
    components: { FormInput },
    data() {
      return {
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
        try {
          const response = await this.$http.post('/api/register/', {
            name: this.name,
            email: this.email,
            password: this.password
          }, {
            emulateJSON: true
          })
          if (response.body.errors) {
            Object.keys(response.body.errors).filter(field => fields.includes(field)).forEach(field => {
              this[this.errorField(field)] = response.body.errors[field][0]
            })
          } else {
            this.$emit('register', this.email)
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
