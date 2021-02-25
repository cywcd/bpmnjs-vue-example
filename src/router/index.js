import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/components/layout/layout'

export const constantRoutes = [{
    path: '/hello',
    component: () => import('@/components/HelloWorld'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home'),
      meta: {
        title: '示例',
        icon: 'home'
      }
    },
    {
      path: 'panel',
      name: 'panel',
      component: () => import('@/views/bpmn-demo/panel'),
      meta: {
        title: '面板示例',
        icon: ''
      }
    }]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router