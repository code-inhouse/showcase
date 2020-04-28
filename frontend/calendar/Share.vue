<template>
  <div class="share-pane__wrapper" @click="hidePopup">
    <div class="share-pane" @click.stop="">
      <div class="share-pane__tabs">
        <a-radio-group v-model="tab">
          <a-radio-button value="view">View &amp; Comment</a-radio-button>
          <a-radio-button value="full" v-if="this.planSettings.edit_id">Full Control</a-radio-button>
          <a-radio-button value="clone" v-else v-show="settings.ALLOW_PLAN_CREATION">Clone</a-radio-button>
        </a-radio-group>
      </div>
      <div class="share-pane__tab">
        <div v-if="tab === 'view'">
          <a-alert message="Share this link with anyone you'd like to view and comment on your trip." type="info" banner />
          <div class="share-pane__link">
            <a-input :value="readLink" class="share-pane__link__input" readonly />
            <a-button icon="copy" type="primary" v-clipboard:copy="readLink" v-clipboard:success="onCopySuccess">Copy</a-button>
          </div>
          <small>
            Tip: Never enter personal information in trip details or activities,
            especially if you intend to share it on public forums (like Reddit).
          </small>
        </div>
        <div v-if="tab === 'full'">
          <a-alert message="WARNING: Anyone with this link can view and modify all aspects of this plan. Only share the link with people you trust." type="warning" banner />
          <div class="share-pane__link">
            <a-input :value="editLink" class="share-pane__link__input" readonly />
            <a-button icon="copy" type="primary" v-clipboard:copy="editLink" v-clipboard:success="onCopySuccess">Copy</a-button>
          </div>
          <small>
            Tip: Save the hyperlink (or bookmark this page) to continue editing your trip later
          </small>
        </div>
        <div v-if="tab === 'clone'">
          <a-alert message="Feeling inspired? Create a new plan with the same destination, duration, and activities, just choose a new start date and plan name." type="info" banner />
          <div class="calendar-header__buttons calendar-header__buttons--clone">
            <a-button type="primary" @click="clonePlan"><span>Clone this Plan</span></a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        tab: 'view',  // view|full
      }
    },
    computed: {
      ...mapGetters({ planSettings: 'planSettings', settings: 'settings' }),
      readLink(){
        return `${window.location.origin}/view/${this.planSettings.read_id}`
      },
      editLink(){
        return `${window.location.origin}/edit/${this.planSettings.edit_id}`
      },
      cloneLink(){
        return `${window.location.origin}/clone/${this.planSettings.read_id}`
      }
    },
    methods: {
      onCopySuccess() {
        this.$message.success('Link copied to clipboard')
      },
      clonePlan(){
        document.location.href = this.cloneLink
      },
      hidePopup(){
        this.$store.commit('togglePane', { pane: 'none' })
      }
    }
  }
</script>
