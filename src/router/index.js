import { createRouter, createWebHistory } from 'vue-router'
import Register from '../components/Register'
import Board from '../components/Board'

const routes = [
  {
    path: '/',
    name: 'Register',
    component: Register
  },
  // lo mismo que arriba pero definido en una vista en vez del componente
  /* {
    path:'/',
    name:'Home',
    component: Home
  }, */
  {
    path: '/game:id',
    name: 'Game',
    component: Board,
    props: true
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
