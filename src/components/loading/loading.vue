<template>
    <div>
      <div class="mask" v-if="">
        <div class="loading">
          <img src="../../assets/loading.gif">
        </div>
      </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {

            }
        },


    }
</script>

<style scroped>
  .mask{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 20;
    background: rgba(0,0,0,1);
  }

</style>
