import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('src/pages/HomePage.vue'),
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('src/pages/UserPage.vue'),
      },
      {
        path: 'comics/:comicId',
        name: 'comic',
        component: () => import('src/pages/ComicPage.vue'),
        props: true,
      },
      {
        path: 'comics/:comicId/chapters/:chapterId',
        name: 'chapter',
        component: () => import('src/pages/ChapterPage.vue'),
        props:true,
      },
      {
        path: 'auth',
        name: 'auth',
        component: () => import('src/pages/AuthPage.vue'),
      },
      {
        path: 'writer/add-comics',
        name: 'adding-comics',
        component: () => import('src/pages/writer/AddComicsPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
];

export default routes;
