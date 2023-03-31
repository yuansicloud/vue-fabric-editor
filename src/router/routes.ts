import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/home/Demo.vue'),
  },
  {
    path: '/about',
    component: () => import('@/views/AboutView.vue'),
  },
];

export default routes;
