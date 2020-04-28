<template>
  <div class="panel panel-cryptic element-box-shadow">
    <div class="panel-heading padding_30">
      <h3 class="no-margin">Social media</h3>
    </div>
    <div class="panel-body padding_30">
      <form class="form-horizontal" @submit="onSubmit">
        <fieldset>
          <FormInput
            v-model="facebook"
            placeholder="/facebook"
          />
          <FormInput
            v-model="twitter"
            placeholder="/twitter"
          />
          <FormInput
            v-model="linkedin"
            placeholder="/linkedin"
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
    components: {
      FormInput,
    },
    props: ['initialFacebook', 'initialLinkedin', 'initialTwitter'],
    data() {
      return {
        facebook: this.initialFacebook,
        linkedin: this.initialLinkedin,
        twitter: this.initialTwitter,
      }
    },
    methods: {
      async onSubmit(e) {
        e.preventDefault()
        try {
          await this.$http.post('/api/update_social_data/', {
            facebook: this.facebook,
            twitter: this.twitter,
            linkedin: this.linkedin,
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
