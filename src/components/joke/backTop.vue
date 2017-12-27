<template>
  <div>
    <div class="back-top">
      <a href="#" @click="goTop"></a>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {}
    },
    methods: {
      goTop(){
        this.$emit('goTop');
      }
    }
  }
</script>

<style scoped rel='stylesheet/scss' lang='scss'>

</style>
