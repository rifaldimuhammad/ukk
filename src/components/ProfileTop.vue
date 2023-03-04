<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiClient, urlApi } from '../api/axios-config';
import Icons from './Icons.vue';

let toggleNotifications = ref(false);
let router = useRouter();
let route = useRoute();

let rowAktifitas = reactive({
  items: [],
});
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
let getAktifitas = async () => {
  let { data } = await apiClient.get('/aktifitas');
  rowAktifitas.items = data.data;
};

let updateAktifitas = async (id) => {
  let { data } = await apiClient.post(`/aktifitas/${id}?_method=PUT`);
  getAktifitas();
};
onMounted(() => {
  getAktifitas();
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
      <ul class="navbar-nav flex-row align-items-center ms-auto">
        <li class="nav-item lh-1 me-3 d-flex align-items-center cursor-pointer position-relative">
          <p class="m-0 notification-icon" @click="toggleNotifications = true">
            <Icons name="bell" height="25px" fill="#566a7f" />
          </p>
          <div v-if="toggleNotifications" class="card position-absolute top-0 end-100">
            <div class="card-header border-bottom d-flex justify-content-between" style="min-width: 350px">
              <h5 class="m-0 text-nowrap">Log Aktifitas</h5>
              <p @click="toggleNotifications = false" class="m-0"><Icons name="close" height="16px" fill="#566a7f" /></p>
            </div>
            <!-- aktifitas card -->
            <div v-for="(item, index) in rowAktifitas.items" :key="index" class="py-2 p-3 bg-label-info d-flex gap-3 align-items-start">
              <div class="d-flex flex-column p-3 bg-white flex-grow-1">
                <div class="d-flex gap-2 align-items-center">
                  <h5 class="m-0">{{ index + 1 }}.</h5>
                  <p class="m-0 text-dark flex-grow-1">Aktifitas {{ item.level_user }}</p>
                  <p @click="updateAktifitas(item.id)" v-if="item.read == 'false'" class="m-0 border-bottom fs-6">Marks read</p>
                </div>
                <div class="d-flex flex-column gap-3 p-2 mt-3" style="background-color: rgba(0, 0, 0, 0.03)">
                  <div class="d-flex gap-2 align-items-center">
                    <div class="overflow-hidden" style="height: 28px; width: 28px; border-radius: 100px">
                      <div class="h-100 w-100 bg-asset" :style="{ background: `url(${urlApi + item.cover_user})` }"></div>
                    </div>
                    <h6 class="m-0 text-black">{{ item.nama_user }}</h6>
                  </div>
                  <p class="m-0 text-dark">{{ item.nama_aktifitas }}</p>
                </div>
              </div>
              <div v-if="item.read == 'false'" class="bg-success flex-grow-1" style="height: 16px; min-width: 16px; border-radius: 100%"></div>
            </div>
            <div class="card-footer"></div>
          </div>
        </li>
        <li class="nav-item navbar-dropdown dropdown-user dropdown">
          <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
            <div class="avatar">
              <img v-if="rowUser.cover != null" :src="urlApi + rowUser.cover" alt="" class="w-px-40 rounded-circle h-100" />
              <img v-else src="/src/assets/img/emptyImage.svg" alt="" class="w-px-40 rounded-circle h-100" />
            </div>
          </a>
          <ul class="dropdown-menu dropdown-menu-end" style="width: unset !important; min-width: unset !important; left: unset">
            <li>
              <a class="dropdown-item" href="#">
                <div class="d-flex">
                  <div class="flex-shrink-0 me-3">
                    <div class="avatar">
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
<style lang="scss">
.notification-icon {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 70%;
    left: 70%;
    background-color: #71dd37;
    height: 10px;
    width: 10px;
    border-radius: 100%;
  }
}
</style>
