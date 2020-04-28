<template lang="html">
  <!-- TOP SECONDARY NAVIGATION -->
  <div class="top_nav">
    <div class="nav_menu">
      <ul class="nav navbar-nav navbar-left">

        <li class="megamenu-li">
          <!-- megamenu -->
          <div class="megamenu-dropdown-wrapper">
            <a class="megamenu-dropdown-trigger megamenu-trigger" href="#0">
              <i class="icon-wallet icons"></i>
    <!-- IGNORE FOR NOW | PLANS FOR IT LATER -->
              <span> My Wallets </span>
              <span class="fa fa-angle-down"></span>
            </a>
            <nav class="megamenu-dropdown">
              <a href="#0" class="megamenu-close">Close</a>
              <ul class="megamenu-dropdown-content">
                <li class="has-children">
                  <a href="#"><i class="cc mmt-icon BTC" title="BTC"></i> Bitcoin</a>

                </li> <!-- .has-children -->
                <li class="has-children">
                  <a href="#"><i class="cc mmt-icon LTC" title="LTC"></i> Litecoin</a>

                </li> <!-- .has-children -->
                <li class="has-children">
                  <a href="#"><i class="cc mmt-icon ETH" title="ETH"></i> Ethereum</a>

                </li> <!-- .has-children -->
                <li class="has-children">
                  <a href="#"><i class="cc mmt-icon DASH" title="DASH"></i> DASH</a>

                </li> <!-- .has-children -->
                <li>
                  <a href="#"><i class="icon-wallet icons cc"></i> Add New Wallet</a>
                </li>
              </ul> <!-- .megamenu-dropdown-content -->
            </nav> <!-- .megamenu-dropdown -->
          </div> <!-- .megamenu-dropdown-wrapper -->
          <!-- megamenu -->
        </li>
        <li class="dropdown-menu-1-li">
          <div class="dropdown-menu-1 dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown"><i class="icon-feed icons"></i> Reports
            <span class="fa fa-angle-down"></span></a>
            <ul class="dropdown-menu archive">
              <li><a href="crypto_address.html"><span class="pull-left">...8b0133 (0.01 BTC)</span> <span class="label label-success pull-right">Success</span></a></li>
              <li><a href="crypto_address.html"><span class="pull-left">...9c3286 (0.07 BTC)</span> <span class="label label-success pull-right">Success</span></a></li>
              <li><a href="crypto_address.html"><span class="pull-left">...4a3432 (0.44 LTC)</span> <span class="label label-danger pull-right">Canceled</span></a></li>
              <li><a href="crypto_address.html"><span class="pull-left">...1e8437 (0.91 BTC)</span> <span class="label label-warning pull-right">Pending</span></a></li>
              <li><a href="crypto_address.html"><span class="pull-left">...8b0133 (3.51 LTC)</span> <span class="label label-success pull-right">Success</span></a></li>
              <li><a href="crypto_address.html"><span class="pull-left">...9c3286 (0.07 ETH)</span> <span class="label label-warning pull-right">Pending</span></a></li>
              <li><a href="crypto_address.html"><span class="pull-left">...8b0133 (0.01 BTC)</span> <span class="label label-success pull-right">Success</span></a></li>
              <li><a href="crypto_address.html"><span class="pull-left">...9c3286 (0.07 BTC)</span> <span class="label label-success pull-right">Success</span></a></li>
            </ul>
          </div>
        </li>

      </ul> <!-- top menu ul -->
      <ul class="nav navbar-nav navbar-right">

        <li class="">
          <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            <img src="/static/assets/images/profile-pic.jpg" alt=""> <span style="display:inline;margin-left:10px;">My Profile</span>
          </a>
          <ul class="dropdown-menu dropdown-usermenu pull-right">
            <li><a href="javascript:;"> Profile</a></li>
            <li>
              <a href="javascript:;">
                <span class="badge bg-red pull-right">50%</span>
                <span>Settings</span>
              </a>
            </li>
            <li><a href="javascript:;">Help</a></li>
            <li><a href="login.html"><i class="fa fa-sign-out pull-right"></i> Log Out</a></li>
          </ul>
        </li>

        <li class="language">
          <a href="javascript:;" class="lang-swich dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
            <img src="/static/assets/images/united-kingdom.svg" alt="uk" style="display:inline;"><span style="display:inline;margin-left:10px;">English</span>
          </a>
          <ul class="dropdown-menu dropdown-usermenu pull-right">
            <li><a href="javascript:;"><img src="assets/images/france.svg" alt="fr"><span>France</span></a></li>
            <li><a href="javascript:;"><img src="assets/images/germany.svg" alt="de"><span>Germany</span></a></li>
            <li><a href="javascript:;"><img src="assets/images/italy.svg" alt="it"><span>Italy</span></a></li>
            <li><a href="javascript:;"><img src="assets/images/spain.svg" alt="es"><span>Spain</span></a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
</style>
