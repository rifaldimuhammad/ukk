<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { urlApi } from '../api/axios-config';

let router = useRouter();
let route = useRoute();

let rowUser = reactive({
  name: '',
  cover: '',
  level: '',
  email: '',
  password: '',
});
const user = JSON.parse(localStorage.getItem('user_data'));
let doLogout = () => {
  router.push({ name: 'login' });
  window.location.reload();
  localStorage.clear();
};

const getUserData = async () => {
  if (user === null) {
    router.push({ name: 'login' });
  } else {
    rowUser.name = user.name;
    rowUser.cover = user.cover;
    rowUser.level = user.level;
    rowUser.email = user.email;
  }
};
onMounted(() => {
  getUserData();
});
</script>
<template>
  <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" style="max-width: 100%; width: 100% !important" id="layout-navbar">
    <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
      <div class="btn-nav-mobile nav-item nav-link px-0 me-xl-4">
        <i class="bx bx-menu bx-sm cursor-pointer"></i>
      </div>
    </div>
    <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
      <!-- Search -->
      
      <!-- /Search -->

      <ul class="navbar-nav flex-row align-items-center ms-auto">
        <!-- Place this tag where you want the button to render. -->
        <li class="nav-item lh-1 me-3 ">
          <span></span>
        </li>

        <!-- User -->
        <li class="nav-item navbar-dropdown dropdown-user dropdown">
          <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
            <div class="avatar avatar-online">
              <img v-if="rowUser.cover != null" :src="urlApi + rowUser.cover" alt="" class="w-px-40 rounded-circle h-100" />
              <img v-else src="/src/assets/img/emptyImage.svg" alt="" class="w-px-40 rounded-circle h-100" />
            </div>
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li>
              <a class="dropdown-item" href="#">
                <div class="d-flex">
                  <div class="flex-shrink-0 me-3">
                    <div class="avatar avatar-online">
                      <img v-if="rowUser.cover != null" :src="urlApi + rowUser.cover" alt="" class="w-px-40 h-auto rounded-circle" />
                      <img v-else src="/src/assets/img/emptyImage.svg" alt="" class="w-px-40 h-auto rounded-circle" />
                    </div>
                  </div>
                  <div class="flex-grow-1">
                    <span class="fw-semibold d-block text-capitalize">{{ rowUser.name }}</span>
                    <small class="text-muted text-capitalize">{{ rowUser.level }}</small>
                  </div>
                </div>
              </a>
            </li>
            <li>
              <div class="dropdown-divider"></div>
            </li>
            <li>
              <RouterLink :to="{ name: 'dashboardAkun' }" class="dropdown-item">
                <i class="bx bx-user me-2"></i>
                <span class="align-middle">My Profile</span>
              </RouterLink>
            </li>
            <li>
              <div class="dropdown-divider"></div>
            </li>
            <li>
              <button class="dropdown-item" @click="doLogout">
                <i class="bx bx-power-off me-2"></i>
                <span class="align-middle">Log Out</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>
