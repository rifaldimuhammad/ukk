<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { apiClient, urlApi } from '../api/axios-config';
import { useRouter, useRoute } from 'vue-router';
import '/src/assets/admin/vendor/css/core.css';
import '/src/assets/admin/vendor/fonts/boxicons.css';
import '/src/assets/admin/vendor/css/theme-default.css';
import '/src/assets/admin/css/demo.css';
import '/src/assets/admin/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';
import '/src/assets/admin/vendor/js/bootstrap.js';
import Icons from '../components/Icons.vue';
import ProfileTop from '../components/ProfileTop.vue';
import HeaderAdmin from '../components/HeaderAdmin.vue';
let router = useRouter();
let route = useRoute();
let rowPesanan = reactive({
  items: [],
});
let rowPesananDetail = reactive({
  items: [],
});

let coreInvoice = reactive({
  id_pesanan: '',
  subTotal: 0,
  jumlahPesanan: '',
});
let getPesanan = async () => {
  let { data } = await apiClient.get(`/pesanan/${route.params.id}`);
  rowPesanan.items = data.data;
  coreInvoice.id_pesanan = rowPesanan.items.id_pesanan;
};
let getDetailPesanan = async () => {
  let { data } = await apiClient.get(`/pesanan-detail/${coreInvoice.id_pesanan}`);
  rowPesananDetail.items = data.data;
  coreInvoice.subTotal = 0;
  rowPesananDetail.items.map((item, index) => {
    let totalPerItem = parseInt(item.harga_menu) * parseInt(item.jumlah_pesanan);
    coreInvoice.subTotal += totalPerItem;
  });
};

onMounted(async () => {
  await getPesanan();
  getDetailPesanan();
});
function addCommas(num) {
  return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
</script>
<template>
  <ProfileTop />
  <HeaderAdmin />
  <div class="container-fluid d-flex align-items-center justify-content-center overflow-auto py-5" style="min-height: 100vh">
    <button @click="router.push({ name: 'dashboardFormMenu' })" class="btn shadow-sm position-fixed top-0 end-0 m-3">&#10005;</button>
    <div class="card" style="height: fit-content">
      <div class="card-header d-flex flex-column align-items-center">
        <h2 class="m-0 text-uppercase text-dark fw-bold">Restourant Invoice</h2>
        <p class="m-0">Address : Jl Goa Jalmo Cendono Jatikauman</p>
        <p class="m-0">Telpon : 1234567890</p>
        <p class="m-0 fw-bold">ID: {{ coreInvoice.id_pesanan }}</p>
      </div>
      <div class="card-body">
        <div class="d-flex flex-column">
          <Icons name="starInvoice" />
          <h3 class="mb-2 text-uppercase text-dark fw-normal text-center">dafatar pesanan</h3>
          <Icons name="starInvoice" />
        </div>
        <div class="d-flex flex-column">
          <table class="table list-price my-4">
            <thead class="border-0">
              <tr class="border-0">
                <th class="m-0 w-100 fw-bold">Nama Menu</th>
                <th class="m-0 w-100 fw-bold">Jumlah</th>
                <th class="m-0 w-100 fw-bold">Harga</th>
                <th class="m-0 w-100 fw-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-0 text-nowrap" v-for="(item, index) in rowPesananDetail.items" :key="index">
                <td class="m-0 w-100">{{ item.nama_menu }}</td>
                <td class="m-0 w-100">{{ item.jumlah_pesanan }}</td>
                <td class="m-0 w-100">Rp {{ addCommas(item.harga_menu) }}</td>
                <td class="m-0 w-100">Rp {{ addCommas(Math.floor(item.harga_menu * item.jumlah_pesanan)) }}</td>
              </tr>
            </tbody>
          </table>
          <Icons name="starInvoice" />
          <div class="my-4">
            <div class="d-flex mb-2 justify-content-between">
              <h5 class="m-0 fw-bold">Total</h5>
              <h5 class="m-0 fw-bold">Rp {{ addCommas(coreInvoice.subTotal) }}</h5>
            </div>
            <div class="d-flex justify-content-between">
              <p class="m-0">Tunai</p>
              <p class="m-0">Rp {{ addCommas(parseInt(rowPesanan.items.tunai)) }}</p>
            </div>
            <div class="d-flex justify-content-between">
              <p class="m-0">Tunai Kembali</p>
              <p class="m-0">Rp {{ addCommas(Math.floor(rowPesanan.items.tunai - coreInvoice.subTotal)) }}</p>
            </div>
          </div>
          <Icons name="starInvoice" />
          <h5 class="m-0 text-uppercase text-dark text-center mt-4 fw-bold">Terima kasih !</h5>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
nav,
aside {
  display: none !important;
}
table,
thead,
tbody,
tr,
td,
th {
  padding-left: 0 !important;
  padding-top: 0 !important;
  border: none !important;
  text-align: start;
}

td,
th {
  &:last-child {
    padding-right: 0;
  }
  &:first-child {
    text-align: start;
  }
}
</style>
