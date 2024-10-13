import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/layout/index.vue'),
      children: [
        {
          path: '/',
          name: 'Home',
          component: () => import('@/views/home.vue')
        },
        {
          path: '/users',
          name: 'Users',
          component: () => import('@/views/users.vue')
        },
        {
          path: '/activities',
          name: 'Activities',
          component: () => import('@/views/activities.vue')
        },
        {
          path: '/myApply',
          name: 'MyApply',
          component: () => import('@/views/myApply.vue')
        },
        {
          path: '/apply',
          name: 'Apply',
          component: () => import('@/views/apply.vue')
        },
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth.vue')
    }
  ]
})

export default router
