import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/views/home/Demo.vue'),
  },
  {
    path: '/',
    component: () => import('@/views/AboutView.vue'),
  },
];

export default routes;
