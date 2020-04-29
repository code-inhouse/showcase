<template>
  <div v-if="user">
    <div class="col-md-3 left_col">
      <div class="scroll-view">
        <Logo />
        <div class="clearfix"></div>
        <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
          <div class="menu_section">
            <h3>Market Overview</h3>
            <div class="clearfix"></div>
            <Navigation />
          </div>
        </div>
        <Footer>
          <FooterButton icon="icon-settings" title="Settings" @click="onSettings" />
          <FooterButton icon="icon-size-fullscreen" title="Fullscreen" @click="onFullscreen" />
          <FooterButton icon="icon-settings" title="Settings" @click="onSettings" />
          <FooterButton icon="icon-power" title="Logout" @click="onLogout" />
        </Footer>
      </div>
    </div>
    <div class="st-container st-effect">
      <div class="container body integrations-wrapper">
        <div class="main_container">
          <TopNavigation />
          <div class="integration" id="integration">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
    <notifications />
  </div>
</template>

<style>
  .container.body.integrations-wrapper {
    padding: 0;
  }

  .integration {
    width: 100%;
  }
  .st-container {
      padding-left: 280px;
  }
  .app-main .text-info {
    font-family: "Open Sans Condensed", "Contrail One", Capriola, Consolas, Monaco, monospace!important;
  }
</style>

<script>
  import Logo from '../components/Logo.vue'
  import Navigation from '../components/Navigation.vue'
  import Footer from '../components/Footer.vue'
  import FooterButton from '../components/FooterButton.vue'
  import TopNavigation from '../components/TopNavigation.vue'

  export default {
    components: {
      Logo,
      Navigation,
      Footer,
      FooterButton,
      TopNavigation
    },
    computed: {
      user() {
        return this.$store.getters.user
      }
    },
    methods: {
      async onLogout() {
        await this.$http.post('/api/logout/')
        window.location.href = '/auth/login'
      },
      onFullscreen() {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      },
      onSettings() {
        this.$router.push('/profile')
      }
    }
  }
</script>
