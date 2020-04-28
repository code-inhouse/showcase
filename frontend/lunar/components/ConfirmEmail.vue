<template>
  <div class="block-page text-center">
      <img src="/static/assets/images/mail.png" alt="mail">
      <h3 class="text-white text-bold">Confirm your email address!</h3>
      <p class="text-white second-p">A confirmation e-mail has been sent to <span>{{ email }}.</span></p>
      <p class="text-white second-p">
        Check your inbox and<br>
        click on the email link to confirm<br>
        <span>your email address.</span>
      </p>
      <p><router-link to="/auth/login">Back to Login</router-link></p>
    </div>
</template>

<script>
  export default {
    props: ['email']
  }
</script>
