<script setup>
import HeaderAdmin from '../../components/HeaderAdmin.vue';
import '/src/assets/admin/vendor/css/core.css';
import '/src/assets/admin/vendor/fonts/boxicons.css';
import '/src/assets/admin/vendor/css/theme-default.css';
import '/src/assets/admin/css/demo.css';
import '/src/assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';
import '/src/assets/admin/vendor/js/bootstrap.js';
import { apiClient } from '../../api/axios-config';
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { $ } from 'dom7';
let router = useRouter();
</script>
<template>
  <div class="dashboard">
    <HeaderAdmin />
    <div class="dashboard-content">
      <RouterView />
    </div>
  </div>
  
</template>
<style lang="scss">
.dashboard {
  &-content {
    margin-left: 260px;
    padding: 2rem;
    min-height: calc(100vh - 7rem);
    height: -webkit-fill-available;
    width: -webkit-fill-available;
    background-color: var(--color-section);

    @media (max-width: 1199.98px) {
      margin-left: 0;
    }
  }
}
</style>
