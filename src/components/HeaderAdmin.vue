<script setup>
import { ref, onMounted } from 'vue';
import Icons from './Icons.vue';
import { useRouter } from 'vue-router';
let router = useRouter();

const user = JSON.parse(localStorage.getItem('user_data'));
const getlevel = (value) => {
  const user = JSON.parse(localStorage.getItem('user_data'));

  if (user === null) {
    router.push({ name: 'landing' });
  } else {
    document.addEventListener('click', (e) => {
      if (document.querySelector('.btn-nav-mobile').contains(e.target)) {
        document.querySelector('#layout-menu').classList.add('trans-0');
      }
      if (!document.querySelector('.btn-nav-mobile').contains(e.target) && !document.querySelector('.layout-menu').contains(e.target)) {
        document.querySelector('#layout-menu').classList.remove('trans-0');
      }
    });
    return value === user.level;
  }
};

onMounted(() => {
  getlevel();
});
</script>
<template>
  <aside id="layout-menu" class="menu-vertical menu bg-menu-theme layout-menu" data-bg-class="bg-menu-theme">
    <div class="my-3">
      <a href="" class="app-brand-link d-flex flex-column">
        <span class="app-brand-logo demo">
          <img style="height: 64px" alt="/src/assets/img/burger.png" src="/src/assets/img/burger.png" />
        </span>
        <span class="app-brand-text demo menu-text fw-bolder ms-2">Restourant</span>
      </a>
    </div>

    <div class="menu-inner-shadow"></div>

    <ul class="menu-inner py-1 ps ps--active-y">
      <!-- Dashboard -->

      <RouterLink :to="{ name: 'dashboard' }" active-class="active" class="menu-item" v-if="getlevel('manager') || getlevel('kasir') || getlevel('admin')">
        <a href="" class="menu-link rounded">
          <Icons name="gauge" fill="#697a8d" height="16px" class="pe-3" />
          <div>Dashboard</div>
        </a>
      </RouterLink>
      <RouterLink :to="{ name: 'kasir' }" active-class="active" class="menu-item" v-if="getlevel('manager') || getlevel('kasir')">
        <a href="" class="menu-link rounded">
          <Icons name="kasir" fill="#697a8d" height="16px" class="pe-3" />
          <div>Kasir</div>
        </a>
      </RouterLink>
      <RouterLink :to="{ name: 'dashboardUser' }" active-class="active" class="menu-item" v-if="getlevel('manager') || getlevel('admin')">
        <a href="" class="menu-link rounded">
          <Icons name="user" fill="#697a8d" height="16px" class="pe-3" />
          <div>User</div>
        </a>
      </RouterLink>
      <RouterLink :to="{ name: 'dashboardFormMenu' }" active-class="active" class="menu-item" v-if="getlevel('manager')">
        <a href="" class="menu-link rounded">
          <Icons name="garpu" fill="#697a8d" height="16px" class="pe-3" />
          <div>Menu</div>
        </a>
      </RouterLink>
      <RouterLink :to="{ name: 'dashboardKategori' }" active-class="active" class="menu-item" v-if="getlevel('manager')">
        <a href="" class="menu-link rounded">
          <Icons name="burger" fill="#697a8d" height="16px" class="pe-3" />
          <div>Kategori</div>
        </a>
      </RouterLink>
      <RouterLink :to="{ name: 'dashboardTransaksi' }" active-class="active" class="menu-item" v-if="getlevel('manager')">
        <a href="" class="menu-link rounded">
          <Icons name="transaksi" fill="#697a8d" height="16px" class="pe-3" />
          <div>Transaksi</div>
        </a>
      </RouterLink>
      <RouterLink :to="{ name: 'dashboardAktifitas' }" active-class="active" class="menu-item" v-if="getlevel('manager')">
        <a href="" class="menu-link rounded">
          <Icons name="activity" fill="#697a8d" height="16px" class="pe-3" />
          <div>Aktifitas</div>
        </a>
      </RouterLink>

      <div class="ps__rail-x" style="left: 0px; bottom: 0px"><div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px"></div></div>
      <div class="ps__rail-y" style="top: 0px; height: 728px; right: 4px"><div class="ps__thumb-y" tabindex="0" style="top: 0px; height: 514px"></div></div>
    </ul>
  </aside>
</template>
<style lang="scss">
.layout-menu,
#layout-menu {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.83, 0, 0.17, 1);

  &.trans-0 {
    transform: translate3d(0, 0, 0);
  }
}
.menu-item.active::before {
  content: '';
  position: absolute;
  right: 0;
  width: 0.25rem;
  height: 2.5rem;
  border-radius: 0.375rem 0 0 0.375rem;
  background-color: #696cff;
}
</style>
