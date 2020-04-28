<template>
  <ul class="nav child_menu" :style="{display: active ? 'block' : 'none'}">
    <slot />
  </ul>
</template>

<script>
  export default {
    props: ['active']
  }
</script>
