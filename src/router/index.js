import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/landing.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
    },

    {
      path: '/indexDashboard',
      name: 'indexDashboard',
      component: () => import('../views/index.vue'),
      children: [
        {
          path: '/dashboard/kasir',
          name: 'kasir',
          component: () => import('../views/kasir.vue'),
          children: [
            {
              path: '/kasir/category=:category',
              name: 'kasirCategory',
              component: () => import('../views/kasir.vue'),
            },
          ],
        },
        {
          path: '/dashboard',
          name: 'dashboard',
          component: () => import('../views/dashboard.vue'),
        },
        {
          path: '/dashboard/akun',
          name: 'dashboardAkun',
          component: () => import('../views/akun.vue'),
        },
        {
          path: '/dashboard/user',
          name: 'dashboardUser',
          component: () => import('../views/user.vue'),
        },

        {
          path: '/dashboard/form-menu',
          name: 'dashboardFormMenu',
          component: () => import('../views/formMenu.vue'),
        },
        {
          path: '/dashboard/kategori',
          name: 'dashboardKategori',
          component: () => import('../views/category.vue'),
        },
        {
          path: '/dashboard/transaksi',
          name: 'dashboardTransaksi',
          component: () => import('../views/transaksi.vue'),
        },
        {
          path: '/dashboard/aktifitas',
          name: 'dashboardAktifitas',
          component: () => import('../views/aktifitas.vue'),
          children: [
            {
              path: '/dashboard/aktifitas=:user',
              name: 'dashboardAktifitasUser',
              component: () => import('../views/aktifitas.vue'),
            },
          ],
        },
      ],
    },
    {
      path: '/invoice/id=:id',
      name: 'invoice',
      component: () => import('../views/invoice.vue'),
    },
  ],
});

// router.beforeEach(async (to, from) => {
//   const isLoggedIn = localStorage.getItem('data_user');
//   // console.log(isLoggedIn);
//   if (isLoggedIn !== null) {
//     // console.log('halaman login');
//     return { name: 'login' };
//   }
// });

export default router;
