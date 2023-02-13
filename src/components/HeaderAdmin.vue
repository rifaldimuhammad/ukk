<script setup>
import { ref, onMounted } from 'vue';
import Icons from './Icons.vue';
import { useRouter } from 'vue-router';
let router = useRouter();

const user = JSON.parse(localStorage.getItem('user_data'));
const getlevel = (value) => {
  return value === user.level;
};

onMounted(() => {
  getlevel();
});
</script>
<template>
  <aside id="layout-menu" class="menu-vertical menu bg-menu-theme layout-menu" data-bg-class="bg-menu-theme">
    <div class="app-brand demo">
      <a href="" class="app-brand-link">
        <span class="app-brand-logo demo">
          <Icons name="garpu" />
        </span>
        <span class="app-brand-text demo menu-text fw-bolder ms-2">Sneat</span>
      </a>

      <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
        <i class="bx bx-chevron-left bx-sm align-middle"></i>
      </a>
    </div>

    <div class="menu-inner-shadow"></div>

    <ul class="menu-inner py-1 ps ps--active-y">
      <!-- Dashboard -->
      <RouterLink :to="{ name: 'kasir' }" active-class="active" class="menu-item" v-if="getlevel('manager') || getlevel('kasir')">
        <a href="" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Kasir</div>
        </a>
      </RouterLink>
      <RouterLink :to="{ name: 'dashboard' }" active-class="active" class="menu-item" v-if="getlevel('manager') || getlevel('kasir') || getlevel('admin')">
        <a href="" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Dashboard</div>
        </a>
      </RouterLink>
      <RouterLink :to="{ name: 'dashboardUser' }" active-class="active" class="menu-item" v-if="getlevel('manager') || getlevel('admin')">
        <a href="" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">User</div>
        </a>
      </RouterLink>

      <li class="menu-header small text-uppercase">
        <span class="menu-header-text">Halaman</span>
      </li>
      <RouterLink :to="{ name: 'dashboardFormMenu' }" active-class="active" class="menu-item" v-if="getlevel('manager')">
        <a href="" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Menu</div>
        </a>
      </RouterLink>
      <li class="menu-header small text-uppercase">
        <span class="menu-header-text">Kategori</span>
      </li>
      <RouterLink :to="{ name: 'dashboardKategori' }" active-class="active" class="menu-item" v-if="getlevel('manager')">
        <a href="" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Kategori</div>
        </a>
      </RouterLink>
      <li class="menu-header small text-uppercase">
        <span class="menu-header-text">Transaksi</span>
      </li>
      <RouterLink :to="{ name: 'dashboardTransaksi' }" active-class="active" class="menu-item" v-if="getlevel('manager')">
        <a href="" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Transaksi</div>
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
