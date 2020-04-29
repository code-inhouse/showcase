<template>
  <section>

    <div class="push-bottom">
      <div class="form-label push-bottom">
        Lunar Trading Labs <i class="icon-down-open"></i>
      </div>
      <p>
        This application connects to the <a class="text-primary-hover" @click="goBinance" href="#">Binance.com</a>
        /static/assets/marketwatch <a href="https://github.com/binance-exchange/binance-official-api-docs" target="_blank">API</a>
        to get live 24h price change data for all crypto trading pairs on their platform and allows you to set
        custom alerts or watch for price change in real time and get desktop notifications when something triggers
        your alerts or price watch settings. We plan to add 10 more exchanges by Beta launch, along with an upgraded RSI/MFI Hunter.
      </p>
      <p>
        This app runs entirely on the browser and only makes external requests to fetch data from various
        API endpoints related to cryptocurrency. Any persisting data is stored in the browser's
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Storage" target="_blank">localStorage</a> database.
        In order to get desktop notifications, you must
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API" target="_blank">Grant Notification Permission</a>
        in your browser.
      </p>
    </div>

    <hr />

    <div class="push-bottom">
      <div class="form-label push-bottom">
        About Lunar Trading Labs <i class="icon-down-open"></i>
      </div>
      <div class="push-bottom">
        This app is only in its ALPHA stage and is not nearly as close to being ready for a full launch. To stay up to date, feel free to subscribe on our website.
      </div>
    </div>


  </section>
</template>

<script>
import Spinner from './Spinner.vue';
import Tabs from './Tabs.vue';

// component
export default {

  // component list
  components: { Spinner, Tabs },

  // component data
  data() {
    return {
      addrlist: [],
    }
  },

  // component methods
  methods: {

    // lick to binance site with ref id added
    goBinance( e ) {
      e.preventDefault();
      this.$bus.emit( 'handleClick', 'binance', '/', '_blank' );
    },

    // copy crypto address to clipboard
    copyAddress( token, address ) {
      let copied = this.$utils.copyText( address );
      if ( !copied ) return this.$bus.emit( 'showNotice', 'Oops, looks like this web browser doesn\'t support that.', 'warning' );
      this.$bus.emit( 'showNotice', token +' address copied successfully.', 'success' );
    },

    // fetch crypto addresses from json file
    fetchJson() {
      this.addrlist = [];
      this.$refs.jsonSpinner.show( 'Fetching addresses' );
      this.$ajax.get( '/static/assets/marketwatch/json/donate.json', {
        type  : 'json',
        proxy : false,
        done  : ( xhr, status, response ) => {
          // check data
          if ( !response || !Array.isArray( response.addresses ) ) {
            return this.$refs.jsonSpinner.error( 'Error fetching donation addresses' );
          }
          this.$refs.jsonSpinner.hide();
          this.addrlist = response.addresses;
        }
      });
    },
  },

  // component mounted
  mounted() {
    setTimeout( this.fetchJson, 100 );
  }

}
</script>
