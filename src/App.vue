<template>
  <div id="app" @touchmove.prevent>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return {
      msg:'笑话'
    }
  }
}
</script>

<style>
  #app{
    margin: 0;
    padding: 0;
  }
.title {
  text-align: center;
  font-size: 30px;
  color: red;
}
</style>
