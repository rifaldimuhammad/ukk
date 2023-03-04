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
      path: '/login',
      name: 'login',
      component: () => import('../views/admin/login.vue'),
    },
    {
      path: '/indexDashboard',
      name: 'indexDashboard',
      component: () => import('../views/admin/index.vue'),
      children: [
        {
          path: '/kasir',
          name: 'kasir',
          component: () => import('../views/admin/kasir.vue'),
          children: [
            {
              path: '/kasir/category=:category',
              name: 'kasirCategory',
              component: () => import('../views/admin/kasir.vue'),
            },
          ],
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../views/admin/dashboard.vue'),
        },
        {
          path: '/dashboard/akun',
          name: 'dashboardAkun',
          component: () => import('../views/admin/akun.vue'),
        },
        {
          path: '/dashboard/user',
          name: 'dashboardUser',
          component: () => import('../views/admin/user.vue'),
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

router.beforeEach(async (to, from) => {
  const isLoggedIn = localStorage.getItem('data_user');
  // console.log(isLoggedIn);
  if (isLoggedIn !== null) {
    // console.log('halaman login');
    return { name: 'login' };
  }
});

export default router;
