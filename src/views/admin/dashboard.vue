<script setup>
import { reactive, onMounted, ref } from 'vue';
import Icons from '../../components/Icons.vue';
import ProfileTop from '../../components/ProfileTop.vue';
import { apiClient } from '../../api/axios-config';
import Timer from '../../components/Timer.vue';
let toggleLoadTransaksi = ref(false);
let rowTransaksiDateNow = reactive({
  items: [],
});
let rowTransaksiDate = reactive({
  items: [],
});
let rowTransaksiMonthNow = reactive({
  items: [],
});
let rowTransaksiWeekNow = reactive({
  items: [],
});
let rowTransaksi = reactive({
  items: [],
});
let dataTransaksi = reactive({
  hariIni: 0,
  bulanIni: 0,
  mingguIni: 0,
});

let date = new Date();
let dateWeek = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate() - date.getDay()}`;
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
  dataTransaksi.hariIni = 0;
  rowTransaksiDateNow.items.map((item) => {
    dataTransaksi.hariIni += parseInt(item.total_harga);
  });
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
  }, 500);
};
const getTransaksiWeekNow = async () => {
  toggleLoadTransaksi.value = true;
  let { data } = await apiClient.get(`/invoice/byDate/${dateWeek}`);
  rowTransaksiWeekNow.items = data.data;
  dataTransaksi.mingguIni = 0;
  rowTransaksiWeekNow.items.map((item) => {
    dataTransaksi.mingguIni += parseInt(item.total_harga);
  });
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
  }, 500);
};
const getTransaksiMonthNow = async () => {
  toggleLoadTransaksi.value = true;
  let { data } = await apiClient.get(`/invoice/byDate/${monthNow}`);
  rowTransaksiMonthNow.items = data.data;
  dataTransaksi.bulanIni = 0;
  rowTransaksiMonthNow.items.map((item) => {
    dataTransaksi.bulanIni += parseInt(item.total_harga);
  });
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
  }, 500);
};
const refreshTable = (value) => {
  getTransaksiDateNow();
};
let selectTransaksi = rowTransaksiDateNow;
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
  } else if (e.target.value == 'transaksiMingguIni') {
    selectTransaksi = rowTransaksiWeekNow;
    getTransaksiWeekNow();
  }
};

let messageDate = ref('');
let onChangeDate = async (e) => {
  toggleLoadTransaksi.value = true;
  const { data } = await apiClient.get(`/invoice/date/${e.target.value}`);
  rowTransaksiDate.items = data.data;
  selectTransaksi = rowTransaksiDate;
  messageDate.value = e.target.value;
  toggleLoadTransaksi.value = false;
};
onMounted(() => {
  getTransaksi();
  getTransaksiDateNow();
  getTransaksiWeekNow();
  getTransaksiMonthNow();
});
</script>
<template>
  <ProfileTop />
  <div class="w-100 mt-4 d-flex gap-4">
    <div class="card position-relative w-100">
      <div class="card-body overflow-hide">
        <h6 class="text-muted font-weight-normal">Seluruh Pendapatan</h6>
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
        <img src="/src/assets/admin/img/dashboard.svg" alt="/src/assets/admin/img/dashboard.svg" class="position-absolute left-end h-100" style="bottom: 0; right: 0" />
      </div>
    </div>
    <div class="card w-100">
      <div class="card-body">
        <h6 class="text-muted font-weight-normal">Pendapatan Hari ini | {{ `${date.getFullYear()}-${date.getUTCMonth() + 1}-${date.getDate()}` }}</h6>
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
  <div class="d-flex gap-4 my-3">
    <div class="card w-100">
      <div class="card-body">
        <h6 class="text-muted font-weight-normal">Pendapatan Minggu ini</h6>
        <div class="row">
          <div class="col-9">
            <div class="d-flex align-items-center align-self-start">
              <h3 class="text-success mb-0 font-weight-medium">+</h3>
              <h3 class="mb-0">Rp {{ dataTransaksi.mingguIni }}.000</h3>
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

    <div class="card w-100">
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

  <div class="card">
    <h5 class="card-header d-flex align-items-center gap-4">
      Transaksi
      <select v-on:change="onSelectTransaksi" name="selectTransaksi" id="selectTransaksi" class="form-control cursor-pointer" style="width: fit-content">
        <option value="semuaTransaksi">Semua Transaksi</option>
        <option selected value="transaksiHariIni">Transaksi Hari Ini</option>
        <option value="transaksiMingguIni">Transaksi Minggu Ini</option>
        <option value="transaksiBulanIni">Transaksi Bulan ini</option>
      </select>
      |
      <div class="text-warning d-flex align-items-center gap-3 text-nowrap">Tanggal : <input type="date" class="form-control" v-on:change="onChangeDate" /></div>
    </h5>

    <div class="table-responsive text-nowrap">
      <table class="table table-dark">
        <thead>
          <tr>
            <th>No</th>
            <th>No Meja</th>
            <th>Status</th>
            <th>jumlah_pesanan</th>
            <th>total harga</th>
            <th>Tanggal / waktu</th>
            <th>Tanggal Update</th>
          </tr>
        </thead>
        <tbody v-if="selectTransaksi.items.length == 0 && toggleLoadTransaksi == false" class="text-dark fw-bold position-relative">
          <div class="alert alert-danger position-absolute top-0 start-50" style="transform: translate(-50%, 50%)">{{ selectTransaksi == rowTransaksiDate ? `Transaksi ${messageDate} Kosong, ` : 'Transaksi Kosong!' }} </div>
        </tbody>
        <tbody>
          <tr v-if="toggleLoadTransaksi && selectTransaksi.items.length == 0" class="position-relative">
            <td style="position: absolute; top: 50%; left: 50%; transform: translate(-50%)">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading... </span>
              </div>
            </td>
          </tr>

          <tr v-else v-for="(item, index) in selectTransaksi.items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <h6 v-if="item.no_meja == '0'" class="text-warning m-0">Di Bawa Pulang</h6>
              <p v-else class="m-0">{{ item.no_meja }}</p>
            </td>
            <td>
              <Timer
                @refresh-table="refreshTable"
                :full-times-tamps="item.timesTamps"
                :update-date="item.updated_at"
                :update-time="item.updated_at_time"
                :time="item.created_at"
                :date="item.created_at_time"
                :no-meja="item.no_meja"
                :waktu="item.waktu"
                :id-invoice="item.id"
                :e-waktu="item.ekstra_waktu"
              />
            </td>
            <td>{{ item.jumlah_pesanan }}</td>
            <td>Rp {{ item.total_harga }}.000</td>
            <td>
              {{ item.created_at }} /
              <p class="text-warning">{{ item.created_at_time }}</p>
            </td>
            <td>
              {{ item.updated_at }} /
              <p class="text-warning">{{ item.updated_at_time }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style lang="scss"></style>
