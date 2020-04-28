<template>
  <div v-if="user" class="right_col" role="main">
    <div class="spacer_30"></div>
    <div class="clearfix"></div>
    <div class="container">
      <div class="row">
        <div class="col-md-12 col-lg-4">
          <div class="panel element-box-shadow">
            <div class="section1">
              <Avatar
                :initialName="`${user.first_name} ${user.last_name}`"
                :initialAvatar="user.avatar || '/static/assets/images/default.png'"
              />
            </div>
            <div class="section2">
              <ProfileMenu />
            </div>
          </div>
        </div>
        <div class="col-md-12 col-lg-8">
          <PersonalDetails
            :initialFirstName="user.first_name"
            :initialLastName="user.last_name"
            :initialEmail="user.email"
            :initialPhone="user.phone_number"
          />
          <SocialMedia
            :initialFacebook="user.facebook"
            :initialLinkedin="user.linkedin"
            :initialTwitter="user.twitter"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .nav-md .container.body .right_col {
    margin-left: 0;
  }

  .section2 ul li {
    list-style-type: none;
    margin-left: 0;
  }
</style>

<script>
  import ProfileMenu from './ProfileMenu.vue'
  import PersonalDetails from './PersonalDetails.vue'
  import SocialMedia from './SocialMedia.vue'
  import Avatar from './Avatar.vue'

  export default {
    components: {
      ProfileMenu,
      PersonalDetails,
      SocialMedia,
      Avatar,
    },
    data() {
      return {
        user: null
      }
    },
    async mounted() {
      const { body: { user } } = await this.$http.get('/api/user/')
      this.user = user
    }
  }
</script>
