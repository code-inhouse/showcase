<template>
  <div class="discuss-pane" @click="stopPropagation">
    <div id="disqus_thread"></div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters({
        pane: 'pane',
        planSettings: 'planSettings'
      }),
    },
    mounted() {
      this.loadDisqus()
      this.registerOutsideClick()
    },
    destroyed() {
      this.unregisterOutsideClick()
    },
    methods: {
      registerOutsideClick() {
        document.body.addEventListener('click', this.onOutsideClick)
      },
      unregisterOutsideClick() {
        document.body.removeEventListener('click', this.onOutsideClick)
      },
      onOutsideClick(e) {
        if (this.pane === 'discuss') {
          this.close()
        }
      },
      stopPropagation(e) {
        e.stopPropagation()
      },
      loadDisqus() {
        const self = this;
        window.disqus_config = function () {
          this.page.url = `http://${window.location.host}/view/${self.planSettings.read_id}`;
          this.page.identifier = self.planSettings.read_id;
        };
        (function() { // DON'T EDIT BELOW THIS LINE
          var d = document, s = d.createElement('script');
          s.src = 'https://itiner-io.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
        })();
      },
      close() {
        this.$store.commit('setPane', { pane: null })
      },
      onClose() {
        this.close()
      },
      onClickOutside() {
        this.close()
      }
    }
  }
</script>
