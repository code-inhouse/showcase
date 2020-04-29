<template>
  <a @click="onClick" data-toggle="tooltip" data-placement="top" :title="title">
    <span :class="`icons ${icon}`" aria-hidden="true"></span>
  </a>
</template>

<script>
  export default {
    props: ['title', 'icon'],
    methods: {
      onClick(e) {
        this.$emit('click', e)
      }
    }
  }
</script>
