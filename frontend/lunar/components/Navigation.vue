<template>
  <ul class="nav side-menu">
    <li :class="{active: marketwatchActive}">
      <NavItem icon="icon-home icon-side" title="Home" />
      <SubNavigation :active="true">
        <SubNavItem to="/marketwatch" title="Coin Watch" />
      </SubNavigation>
    </li>

    <li :class="{active: chartsActive}">
      <NavItem icon="icon-layers" title="Live Charts" />
      <SubNavigation :active="true">
        <SubNavItem to="/candles" title="Eagle One" />
      </SubNavigation>
    </li>
  </ul>
</template>

<style>
  .nav.side-menu li {
    margin-left: 0;
  }

  .nav.side-menu li > a {
    text-decoration: none;
  }

  .nav-md ul.nav.child_menu li:before {
    margin-top: 20px;
  }
</style>

<script>
  import NavItem from './NavItem.vue'
  import SubNavItem from './SubNavItem.vue'
  import SubNavigation from '../components/SubNavigation.vue'
  import Navigation from '../components/Navigation.vue'

  export default {
    components: {
      NavItem,
      SubNavigation,
      SubNavItem
    },
    computed: {
      chartsActive() {
        return this.$route.path == '/candles'
      },
      marketwatchActive() {
        return this.$route.path == '/marketwatch'
      }
    }
  }
</script>
