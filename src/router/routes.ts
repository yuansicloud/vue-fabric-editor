import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Editor',
    component: () => import('@/views/home/index.vue'),
  },
  // {
  //   path: '/',
  //   component: () => import('@/views/AboutView.vue'),
  // },
];

export default routes;
