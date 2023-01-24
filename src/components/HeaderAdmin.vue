<script setup>
import { ref } from 'vue';
import Icons from './Icons.vue';
import { useRouter } from 'vue-router';
let router = useRouter();
let togglePopupProfile = ref(false);
</script>
<template>
  <aside id="layout-menu" class="menu-vertical menu bg-menu-theme" data-bg-class="bg-menu-theme">
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
      <RouterLink :to="{ name: 'dashboard' }" active-class="active" class="menu-item">
        <a href="" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Dashboard</div>
        </a>
      </RouterLink>

      <li class="menu-header small text-uppercase">
        <span class="menu-header-text">Halaman</span>
      </li>
      <RouterLink :to="{ name: 'dashboardFormMenu' }" active-class="active" class="menu-item">
        <a href="" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Menu</div>
        </a>
      </RouterLink>
      <li class="menu-header small text-uppercase">
        <span class="menu-header-text">Kategori</span>
      </li>
      <RouterLink :to="{ name: 'dashboardKategori' }" active-class="active" class="menu-item">
        <a href="" class="menu-link">
          <i class="menu-icon tf-icons bx bx-home-circle"></i>
          <div data-i18n="Analytics">Kategori</div>
        </a>
      </RouterLink>
      <li class="menu-header small text-uppercase">
        <span class="menu-header-text">Transaksi</span>
      </li>
      <RouterLink :to="{ name: 'dashboardTransaksi' }" active-class="active" class="menu-item">
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
#layout-menu {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  height: 100%;
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
.sidebar {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 30rem;
  height: -webkit-fill-available;
  background-color: var(--color-section);
  &-wrapper {
    padding: 3rem;
  }
  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5rem;
    &-logo {
      img {
        height: 5rem;
      }
    }
    &-close {
      & svg {
        cursor: pointer;
        height: 3rem;
        fill: var(--color-admin-blue);
      }
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 3rem;
    &-title {
      padding: 0rem 1.6rem;
      font-size: 2rem;
      text-transform: capitalize;
    }
    &-item {
      display: flex;
      align-items: center;
      gap: 2rem;
      border-radius: 0.7rem;
      padding: 1rem 1.6rem;
      color: var(--color-admin-blue-dark);
      fill: var(--color-admin-blue-dark);
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        box-shadow: 4px 8px 2rem rgba(grey, 0.1);
      }
      &.active {
        background-color: var(--color-admin-blue);
        color: white;
        fill: white;
      }
      &-icon {
        display: flex;
        align-items: center;
        & svg {
          height: 1.6rem;
        }
      }
      &-text {
        font-size: 1.6rem;
        text-transform: capitalize;
      }
    }
  }
}
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: -webkit-fill-available;
  width: -webkit-fill-available;
  margin-left: 30rem;
  background-color: white;
  height: 7rem;
  background-color: var(--color-section);

  z-index: 100;
  &-wrapper {
    width: -webkit-fill-available;
    height: -webkit-fill-available;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 3rem;
    &-profile {
      position: relative;
      &-src {
        border-radius: 100%;
        height: 4rem;
        width: 4rem;
        background-size: cover !important;
        background-position: center !important;
      }

      & .profile-popup {
        position: absolute;
        top: 3rem;
        right: 0;
        min-width: 23rem;
        &-wrapper {
          background-color: white;
          box-shadow: 4px 4px 2rem rgba(grey, 0.7);
          border-radius: 0.7rem;
          &-top {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.8rem 1.6rem;
            border-bottom: solid 1px rgba(grey, 0.2);
            &-left {
              &-img {
                height: 4rem;
                width: 4rem;
                border-radius: 100%;
                background-size: cover !important;
                background-position: center !important;
              }
            }
            &-right {
              & p {
                text-transform: capitalize;
                &:nth-child(1) {
                  font-size: 1.6rem;
                  font-weight: 600;
                  color: rgba(58, 53, 65, 0.87);
                }
                &:nth-child(2) {
                  font-size: 1.4rem;
                  font-weight: 400;
                  color: rgba(grey, 0.5);
                }
              }
            }
          }
          &-bot {
            &-item {
              padding: 1rem 1.6rem;
              display: flex;
              align-items: center;
              gap: 1rem;
              color: rgba(58, 53, 65, 0.87);
              fill: rgba(58, 53, 65, 0.87);
              transition: all 0.3s;
              &:hover {
                background-color: rgba(grey, 0.11);
              }
              & svg {
                height: 1.6rem;
              }
              & p {
                text-transform: capitalize;
                font-size: 1.6rem;
              }
            }
          }
        }
      }
    }
  }
}
</style>
