<script setup>
import '/src/assets/admin/vendor/css/core.css';
import '/src/assets/admin/vendor/fonts/boxicons.css';
import '/src/assets/admin/vendor/css/theme-default.css';
import '/src/assets/admin/css/demo.css';
import '/src/assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';
import '/src/assets/admin/vendor/js/bootstrap.js';
import Icons from '../components/Icons.vue';
import router from '../router';
import { onMounted, reactive } from 'vue';
import { apiClient, urlApi } from '../api/axios-config';

let rowMenu = reactive({
  items: [],
});
let getMenu = async () => {
  let { data } = await apiClient.get('/menu');
  rowMenu.items = data.data;
};
onMounted(() => {
  getMenu();
});
</script>
<template>
  <div class="container-fluid d-flex position-relative flex-column justify-content-between" style="min-height: 100vh">
    <div class="bg-video position-absolute top-0 end-0 h-100 w-100">
      <video class="h-100 w-100" muted autoplay loop src="/src/assets/video2.mp4"></video>
    </div>
    <header class="d-flex align0-items p-5 justify-content-between">
      <div class="d-flex gap-2 align-items-center">
        <Icons name="burger" fill="#fff" height="36" />
        <h6 class="m-0 text-white font-landing">Kasir Restaurant</h6>
      </div>
      <button @click="router.push({ name: 'login' })" class="btn text-dark btn-light font-landing" style="border-radius: 100px">Login</button>
    </header>
    <div class=" h-100">
      <p class="m-0 font-landing fw-lighter text-white text-uppercase" style="transform: translateY(70px)">Healthy Inside, Fresh Outside Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
      <p class="m-0 font-landing text-white fw-bold text-uppercase text-landing">Healthy</p>
    </div>
  </div>
  <div class="bg-white p-5" style="border-radius: 30px 30px 0 0; transform: translateY(-20px)">
    <div class="d-flex gap-4 flex-wrap gap-5 justify-content-center">
      <div v-for="(item, index) in rowMenu.items" :key="index" class="d-flex flex-column gap-4">
        <img :src="urlApi + item.cover" alt="" height="100" />
      </div>
    </div>
    <footer class="d-flex align-items-center justify-content-between mt-5">
      <div class="d-flex gap-2 align-items-center d-">
        <Icons name="burger" fill="#566a7f" height="36" />
        <h6 class="m-0 font-landing">Kasir Restaurant</h6>
      </div>
      <p class="m-0 font-landing fw-lighter">Copyright Muhammad RIfaldi 2023 © All rights reserved</p>
    </footer>
  </div>
</template>
<style lang="scss">
.bg-video {
  video {
    object-fit: cover;
  }
}
.text-landing {
  font-size: 200px;
}
</style>
