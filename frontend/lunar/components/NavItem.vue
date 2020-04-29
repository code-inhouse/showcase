<template>
  <a>
    <i :class="`${icon} icons`"></i>
    <span>{{ title }}</span>
    <span class="fa fa-angle-down"></span>
  </a>
</template>

<script>
  export default {
    props: ['icon', 'title', {
      name: 'active',
      type: Boolean,
      default: false,
    }]
  }
</script>
