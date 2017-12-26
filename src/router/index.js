import Vue from 'vue'
import Router from 'vue-router'

const Joke = (reslove) => {
  import('@/components/joke/joke').then((module) => {
    reslove(module)
  })
}

Vue.use(Router)


export default new Router({
  linkActiveClass: "active",
  mode: 'history',
  routes: [
    {
      path: '/:id',
      name: 'joke',
      component: Joke
    }
  ]
})
