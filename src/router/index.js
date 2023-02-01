import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [ 
        {
          path: '/category=:category',
          name: 'homeCategory',
          component: HomeView,
        },
      ],
    },
    {
      path: '/detail-menu/:id/:name',
      name: 'detailMenu',
      component: () => import('../views/detailMenu.vue'),
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('../views/cart.vue'),
    },
    {
      path: '/indexDashboard',
      name: 'indexDashboard',
      component: () => import('../views/admin/index.vue'),
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../views/admin/dashboard.vue'),
        },

        {
          path: '/dashboard/form-menu',
          name: 'dashboardFormMenu',
          component: () => import('../views/admin/formMenu.vue'),
        },
        {
          path: '/dashboard/kategori',
          name: 'dashboardKategori',
          component: () => import('../views/admin/category.vue'),
        },
        {
          path: '/dashboard/transaksi',
          name: 'dashboardTransaksi',
          component: () => import('../views/admin/transaksi.vue'),
        },
      ],
    },
  ],
});

export default router;
