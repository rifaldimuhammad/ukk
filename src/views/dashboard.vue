<script setup>
import { reactive, onMounted, ref } from 'vue';
import ProfileTop from '../components/ProfileTop.vue';
import { apiClient } from '../api/axios-config';
import Timer from '../components/Timer.vue';
let toggleLoadTransaksi = ref(false);
let loadDataDashboard = ref(false);
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
  startWeek: '',
  endWeek: '',
  items: [],
});
let rowTransaksi = reactive({
  items: [],
});
let dataTransaksi = reactive({
  hariIni: 0,
  bulanIni: 0,
  mingguIni: 0,
  all: 0,
});

let date = new Date();
let dateNow = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
let monthNow = `${date.getFullYear()}-${date.getMonth() + 1}-0`;
const getTransaksi = async () => {
  loadDataDashboard.value = true;
  toggleLoadTransaksi.value = true;
  let { data } = await apiClient.get(`/pesanan`);
  rowTransaksi.items = data.data;
  dataTransaksi.all = 0;
  rowTransaksi.items.map((item) => {
    dataTransaksi.all += parseInt(item.total_harga);
  });
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
    loadDataDashboard.value = false;
  }, 500);
};
const getTransaksiDateNow = async () => {
  loadDataDashboard.value = true;
  toggleLoadTransaksi.value = true;
  let { data } = await apiClient.get(`/pesanan/byDate/${dateNow}`);
  rowTransaksiDateNow.items = data.data;
  loadDataDashboard.value = false;
  dataTransaksi.hariIni = 0;
  rowTransaksiDateNow.items.map((item) => {
    dataTransaksi.hariIni += parseInt(item.total_harga);
  });
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
    loadDataDashboard.value = false;
  }, 500);
};
const getTransaksiWeekNow = async () => {
  toggleLoadTransaksi.value = true;
  loadDataDashboard.value = true;
  let { data } = await apiClient.get(`/pesanan/pesananWeek`);
  rowTransaksiWeekNow.startWeek = data.startWeek;
  rowTransaksiWeekNow.endWeek = data.endWeek;
  rowTransaksiWeekNow.items = data.data;
  dataTransaksi.mingguIni = 0;
  rowTransaksiWeekNow.items.map((item) => {
    dataTransaksi.mingguIni += parseInt(item.total_harga);
  });
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
    loadDataDashboard.value = false;
  }, 500);
};
const getTransaksiMonthNow = async () => {
  toggleLoadTransaksi.value = true;
  loadDataDashboard.value = true;
  let { data } = await apiClient.get(`/pesanan/byDate/${monthNow}`);
  rowTransaksiMonthNow.items = data.data;
  dataTransaksi.bulanIni = 0;
  rowTransaksiMonthNow.items.map((item) => {
    dataTransaksi.bulanIni += parseInt(item.total_harga);
  });
  setTimeout(() => {
    loadDataDashboard.value = false;
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
  const { data } = await apiClient.get(`/pesanan/date/${e.target.value}`);
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
function addCommas(num) {
  return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
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
              <div v-if="loadDataDashboard" class="placeholder-glow w-100">
                <div class="d-flex gap-3">
                  <span class="placeholder col-8"></span>
                  <span class="placeholder col-1"></span>
                </div>
                <span class="placeholder col-6"></span>
              </div>
              <h3 v-else class="mb-0">Rp {{ addCommas(dataTransaksi.all) }}</h3>
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
              <div v-if="loadDataDashboard" class="placeholder-glow w-100">
                <div class="d-flex gap-3">
                  <span class="placeholder col-8"></span>
                  <span class="placeholder col-1"></span>
                </div>
                <span class="placeholder col-6"></span>
              </div>
              <div v-else class="d-flex">
                <h3 class="text-success mb-0 font-weight-medium">+</h3>
                <h3 class="mb-0">Rp {{ addCommas(dataTransaksi.hariIni) }}</h3>
              </div>
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
        <h6 class="text-muted font-weight-normal">Pendapatan Minggu ini | {{ rowTransaksiWeekNow.startWeek }} - {{ rowTransaksiWeekNow.endWeek }}</h6>
        <div class="row">
          <div class="col-9">
            <div class="d-flex align-items-center align-self-start">
              <div v-if="loadDataDashboard" class="placeholder-glow w-100">
                <div class="d-flex gap-3">
                  <span class="placeholder col-8"></span>
                  <span class="placeholder col-1"></span>
                </div>
                <span class="placeholder col-6"></span>
              </div>
              <div v-else class="d-flex">
                <h3 class="text-success mb-0 font-weight-medium">+</h3>
                <h3 class="mb-0">Rp {{ addCommas(dataTransaksi.mingguIni) }}</h3>
              </div>
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
            <div v-if="loadDataDashboard" class="placeholder-glow w-100">
              <div class="d-flex gap-3">
                <span class="placeholder col-8"></span>
                <span class="placeholder col-1"></span>
              </div>
              <span class="placeholder col-6"></span>
            </div>
            <div v-else class="d-flex align-items-center align-self-start">
              <h3 class="mb-0">Rp {{ addCommas(dataTransaksi.bulanIni) }}</h3>
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
            <th>Status Tempat</th>
            <th>Status</th>
            <th>jumlah_pesanan</th>
            <th>total harga</th>
            <th>Tanggal / waktu</th>
            <th>Tanggal Update</th>
          </tr>
        </thead>
        <tbody v-if="toggleLoadTransaksi == false && selectTransaksi.items" class="text-dark fw-bold position-relative">
          <div class="alert alert-danger position-absolute top-0 start-50" style="transform: translate(-50%, 50%)">{{ selectTransaksi == rowTransaksiDate ? `Transaksi ${messageDate} Kosong, ` : 'Transaksi Kosong!' }}</div>
        </tbody>
        <tbody>
          <tr v-if="toggleLoadTransaksi">
            <td><div class="spinner-border"></div></td>
            <td><div class="spinner-border"></div></td>
            <td><div class="spinner-border"></div></td>
            <td><div class="spinner-border"></div></td>
            <td><div class="spinner-border"></div></td>
            <td><div class="spinner-border"></div></td>
            <td><div class="spinner-border"></div></td>
          </tr>

          <tr v-else v-for="(item, index) in selectTransaksi.items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <h6 v-if="item.no_meja == '0'" class="text-warning m-0">Di Bawa Pulang</h6>
              <p v-else class="m-0">Meja {{ item.no_meja }}</p>
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
            <td>Rp {{ addCommas(item.total_harga) }}</td>
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
