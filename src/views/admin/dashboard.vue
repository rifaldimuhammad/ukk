<script setup>
import { reactive, onMounted, ref } from 'vue';
import Icons from '../../components/Icons.vue';
import ProfileTop from '../../components/ProfileTop.vue';
import { apiClient } from '../../api/axios-config';
let toggleLoadTransaksi = ref(false);
let rowTransaksiDateNow = reactive({
  items: [],
});
let rowTransaksiMonthNow = reactive({
  items: [],
});
let rowTransaksi = reactive({
  items: [],
});
let dataTransaksi = reactive({
  hariIni: 0,
  bulanIni: 0,
});
let date = new Date();
let dateNow = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
let monthNow = `${date.getFullYear()}-${date.getMonth()}-0`;

const getTransaksi = async () => {
  toggleLoadTransaksi.value = true;
  let { data } = await apiClient.get(`/invoice`);
  rowTransaksi.items = data.data;
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
  }, 500);
};
const getTransaksiDateNow = async () => {
  toggleLoadTransaksi.value = true;
  let { data } = await apiClient.get(`/invoice/byDate/${dateNow}`);
  rowTransaksiDateNow.items = data.data;
  rowTransaksiDateNow.items.map((item) => {
    dataTransaksi.hariIni = 0;
    dataTransaksi.hariIni += parseInt(item.total_harga);
  });
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
  }, 500);
};
const getTransaksiMonthNow = async () => {
  toggleLoadTransaksi.value = true;
  let { data } = await apiClient.get(`/invoice/byDate/${monthNow}`);
  rowTransaksiMonthNow.items = data.data;
  rowTransaksiMonthNow.items.map((item) => {
    dataTransaksi.bulanIni = 0;
    dataTransaksi.bulanIni += parseInt(item.total_harga);
  });
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
  }, 500);
};
let selectTransaksi = rowTransaksi;
let onSelectTransaksi = (e) => {
  if (e.target.value == 'semuaTransaksi') {
    selectTransaksi = rowTransaksi;
    getTransaksi();
  } else if (e.target.value == 'transaksiHariIni') {
    selectTransaksi = rowTransaksiDateNow;
    getTransaksiDateNow();
  } else if (e.target.value == 'transaksiBulanIni') {
    selectTransaksi = rowTransaksiMonthNow;
    getTransaksiMonthNow();
  }
};
onMounted(() => {
  getTransaksi();
  getTransaksiDateNow();
  getTransaksiMonthNow();
});
</script>
<template>
  <ProfileTop />
  <div class="row mt-3">
    <div class="col-xl-3 col-sm-6 grid-margin mb-3 stretch-card">
      <div class="card">
        <div class="card-body">
          <h6 class="text-muted font-weight-normal">Pendapatan Hari ini</h6>
          <div class="row">
            <div class="col-9">
              <div class="d-flex align-items-center align-self-start">
                <h3 class="text-success mb-0 font-weight-medium">+</h3>
                <h3 class="mb-0">Rp {{ dataTransaksi.hariIni }}.000</h3>
              </div>
            </div>
            <div class="col-3">
              <div class="icon icon-box-success">
                <span class="mdi mdi-arrow-top-right icon-item"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-xl-3 col-sm-6 grid-margin mb-3 stretch-card">
      <div class="card">
        <div class="card-body">
          <h6 class="text-muted font-weight-normal">Pendapatan Bulan Ini</h6>
          <div class="row">
            <div class="col-9">
              <div class="d-flex align-items-center align-self-start">
                <h3 class="mb-0">Rp {{ dataTransaksi.bulanIni }}.000</h3>
                <p class="text-success ml-2 mb-0 font-weight-medium">+11%</p>
              </div>
            </div>
            <div class="col-3">
              <div class="icon icon-box-success">
                <span class="mdi mdi-arrow-top-right icon-item"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <h5 class="card-header d-flex align-items-center gap-4">
      Transaksi
      <select v-on:change="onSelectTransaksi" name="selectTransaksi" id="selectTransaksi" class="form-control cursor-pointer" style="width: fit-content">
        <option selected value="semuaTransaksi">Semua Transaksi</option>
        <option value="transaksiHariIni">Transaksi Hari Ini</option>
        <option value="transaksiBulanIni">Transaksi Bulan ini</option>
      </select>
    </h5>
    <div class="table-responsive text-nowrap">
      <table class="table table-dark">
        <thead>
          <tr>
            <th>id</th>
            <th>id pesanan</th>
            <th>id menu</th>
            <th>jumlah_pesanan</th>
            <th>total harga</th>
            <th>Tanggal / waktu</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="toggleLoadTransaksi" class="position-relative">
            <td style="position: absolute; top: 50%; left: 50%; transform: translate(-50%)">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading... </span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(item, index) in selectTransaksi.items" :key="index">
            <td>{{ item.id }}</td>
            <td>
              <i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>{{ item.id_pesanan }}</strong>
            </td>
            <td>{{ item.id_menu }}</td>
            <td>{{ item.jumlah_pesanan }}</td>
            <td>Rp {{ item.total_harga }}k</td>
            <td>
              {{ item.created_at }} /
              <p class="text-warning">{{ item.created_at_time }}</p>
            </td>
            <td>
              <div class="dropdown">
                <button @click="toggleActionTable = true" type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                  <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                  <button class="dropdown-item"><i class="bx bx-edit-alt me-1"></i> Edit</button>
                  <button class="dropdown-item" @click="deleteInvoice(item.id)"><i class="bx bx-trash me-1"></i> Delete</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style lang="scss"></style>
