import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Dict from './views/Dict.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/dict',
      name: 'Dict',
      component: Dict
    }
  ]
})
