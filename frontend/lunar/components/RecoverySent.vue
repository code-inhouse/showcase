<template>
  <div class="block-page text-center">
    <img src="/static/assets/images/mail.png" alt="mail">
    <h3 class="text-white text-bold">Check your email!</h3>
    <p class="text-white second-p">A password recovery e-mail has been sent to <span>{{ email }}.</span></p>
    <p class="text-white second-p">
      Check your inbox and click on the email link to recovery your password.
    </p>
    <p><router-link to="/auth/login">Back to Login</router-link></p>
  </div>
</template>

<script>
  export default {
    props: ['email']
  }
</script>
