<template>
  <li><router-link :to="to"><span>{{ title }}</span></router-link></li>
</template>

<script>
  export default {
    props: ['to', 'title']
  }
</script>
