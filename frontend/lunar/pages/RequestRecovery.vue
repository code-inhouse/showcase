<template>
  <RequestRecoveryForm @done="onDone" v-if="requesting" />
  <RecoverySent :email="email" v-else />
</template>

<script>
  import RequestRecoveryForm from '../components/RequestRecoveryForm.vue';
  import RecoverySent from '../components/RecoverySent.vue';

  export default {
    components: { RequestRecoveryForm, RecoverySent },
    data() {
      return {
        email: '',
        requesting: true,
      }
    },
    methods: {
      onDone(email) {
        this.email = email
        this.requesting = false
      }
    }
  }
</script>
