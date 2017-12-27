// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// import '../static/flexible'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './common/style/element-variables.scss'

import lazyload from 'vue-lazyload'



Vue.use(ElementUI, { size: 'small' })

Vue.use(lazyload,{
  loading:require('./assets/loading.gif')
})
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
