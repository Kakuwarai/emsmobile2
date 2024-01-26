import { createRouter, createWebHashHistory } from 'vue-router'
import frontPage from '../components/frontPage.vue'

const routes = [
  {
    path: '/',
    name: 'frontPage',
    component: frontPage
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
