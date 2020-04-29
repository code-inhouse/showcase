<template lang="html">
  <div class="main" v-if="!showLoader && !showCreationLoader">
    <div v-if="clone">
      <PlanSettings type="clone" :initialCity="planSettings ? planSettings.city : null" @hideClone="hideClone"/>
    </div>
    <div v-else-if="planSettings.id">
      <Plan></Plan>
    </div>
    <div v-else>
      <div class="landing">
        <div class="content">
          <h1>Itinerio is a rapid trip planning tool built for easy collaboration</h1>
          <a-button
            type="primary"
            size="large"
            class="landing__start-btn"
            @click="showPlan"
            :disabled="!isCreationEnabled">
            <span v-if="isCreationEnabled">Start Planning Now</span>
            <span v-else>Coming Soon</span>
          </a-button>
          <p class="landing__comment">Totally free. No account required.</p>
          <div class="landing-how-it-works">
            <h2>How it works</h2>
            <ul>
              <li><a-icon type="form" />1. Enter where you're going and when</li>
              <li><a-icon type="calendar" />2. Add activities and ideas to your schedule</li>
              <li><a-icon type="share-alt" />3. Share your plan easily with a hyperlink</li>
            </ul>
          </div>
        </div>
        <footer>
          <ul>
            <li><a @click="feedback">Feedback</a>|</li>
            <li><a target="_blank" href="https://www.iubenda.com/privacy-policy/37332083">Privacy Policy</a></li>
          </ul>
        </footer>
        <PlanSettings v-show="planSettingsVisible" type="create"/>
      </div>
    </div>
  </div>
</template>

<script>
import Plan from './Plan.vue'
import PlanSettings from './PlanSettings.vue'
import {mapGetters} from 'vuex';

export default {
  data(){
    return {
      planPage: false,
      isCreationEnabled: true,
      showLoader: true,
      showCreationLoader: true,
      clone: false
    }
  },
  computed: {
    ...mapGetters({
      planSettings: 'planSettings',
      planSettingsVisible: 'planSettingsVisible',
      settings: 'settings',
    })
  },
  components: {
    Plan,
    PlanSettings,
  },
  methods: {
    showPlan(){
      this.$store.commit('showPlanSettings')
    },
    fetchCreationSettings() {
      this.showCreationLoader = true
      fetch('/api/settings/')
        .then(res => res.json())
        .then(({ ALLOW_PLAN_CREATION }) => {
          this.isCreationEnabled = ALLOW_PLAN_CREATION
          this.showCreationLoader = false
        })
    },
    hideClone(){
      this.clone = false
    },
    router(){
      const path = window.location.pathname

      if (path.match(/(edit|view)\/(.*)\/?/)) {
        new Promise((resolve) => {
          let editId = path.match(/(edit|view)\/(.*)/)[2]
          if (editId[editId.length - 1] == '/') {
            editId = editId.slice(0, -1)
          }
          this.$store.dispatch('checkPlanID', {editId, resolve});
        }).then(()=>this.showLoader = false)
      } else if (path.match(/(clone)\/(.*)\/?/)) {
        let editId = path.match(/(clone)\/(.*)/)[2]
        if (editId[editId.length - 1] == '/') {
          editId = editId.slice(0, -1)
        }
        new Promise((resolve) => {
          this.$store.dispatch('checkPlanID', {editId, resolve});
        }).then(()=>{
          this.showLoader = false
          this.clone = true
        })
      } else {
        if (path != "/") {
          document.location.href="/";
          this.showLoader = false
        }
        this.showLoader = false
      }
    },
    feedback(){
      document.getElementById('doorbell-button').click()
    },
    setHeightPixel(){
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
  },
  mounted(){
    this.fetchCreationSettings()
    this.router()
    this.setHeightPixel()
    window.onresize = (event) => {
       this.setHeightPixel()
    };
  }
}
</script>
