<template lang="html">
  <!-- TOP SECONDARY NAVIGATION -->
  <div class="top_nav">
    <div class="nav_menu">
      <ul class="nav navbar-nav navbar-right">

        <li class="">
          <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            <img :src="avatar" alt=""> <span style="display:inline;margin-left:10px;">My Profile</span>
          </a>
          <ul class="dropdown-menu dropdown-usermenu pull-right">
            <li><router-link to="/profile"> Settings</router-link></li>
            <li><a href="javascript:;" @click="onLogout"><i class="fa fa-sign-out pull-right"></i> Log Out</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<style lang="scss">
.top_nav {
  margin: auto;
}
</style>

<script>
export default {
  computed: {
    avatar() {
      return this.$store.getters.user.avatar
    },
  },
  methods: {
    async onLogout() {
      await this.$http.post('/api/logout/')
      window.location.href = '/'
    }
  }
}
</script>
