<template>
  <RegisterForm v-if="registering" @register="onRegister" />
  <ConfirmEmail v-else :email="email" />
</template>

<script>
  import RegisterForm from '../components/RegisterForm.vue';
  import ConfirmEmail from '../components/ConfirmEmail.vue';

  export default {
    components: { RegisterForm, ConfirmEmail },
    data() {
      return {
        registering: true,
        email: ''
      }
    },
    methods: {
      onRegister(email) {
        this.email = email
        this.registering = false
      }
    }
  }
</script>
