<script setup>
import { onMounted, reactive, ref, defineEmits } from 'vue';
import { apiClient } from '../api/axios-config';
import swal from 'sweetalert';
let toggleLoadTimer = ref(false);
let toggleBtnAlert = ref(false);
let toggleModalAddTime = ref(false);

let props = defineProps({
  idInvoice: Number,
  date: String,
  updateDate: String,
  updateTime: String,
  time: String,
  noMeja: String,
  waktu: String,
  eWaktu: String,
});
let formTimer = reactive({
  waktu: 1,
});
let timer = reactive({
  value: '',
});
let formGoHome = reactive({
  ekstra_waktu: 'false',
});
let distance;
let timesTamps = `${props.date} ${props.time}`;
let updateTimesTamps = `${props.updateDate} ${props.updateTime}`;
var countDownDate = new Date(props.eWaktu == 'true' ? updateTimesTamps : timesTamps).getTime() + Math.floor(props.waktu * 60000);
let x = setInterval(function () {
  var now = new Date().getTime();
  distance = countDownDate - now;
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  timer.value = hours + ' Jam ' + minutes + 'm ' + seconds + 's ';
  if (distance < 0) {
    clearInterval(x);
    if (props.eWaktu == 'true') {
      toggleBtnAlert.value = true;
    } else {
      toggleBtnAlert.value = false;
      timer.value = 'wees Moleee';
    }
  }
}, 1000);

const updateTime = async (id) => {
  if (props.eWaktu == 'true') {
    const { data } = await apiClient.post(`/invoice/${id}?_method=PUT`, formTimer);
    swal({
      icon: 'success',
      title: 'Waktu Berhasil DI Tambah',
    });
    toggleModalAddTime.value = false;
  } else {
    toggleBtnAlert.value = false;
  }
};

const emit = defineEmits(['refreshTable']);
const goHome = async () => {
  await apiClient.post(`/invoice/updateEkstra/${props.idInvoice}`, formGoHome);
  apiClient.post(`/meja/${props.noMeja}?_method=PUT`, props.noMeja);
  toggleModalAddTime.value = false;
  emit('refresh-table', true);
  swal({
    icon: 'success',
    title: 'Pelanggan sudah pulang',
  });
};
</script>
<template>
  <div v-if="toggleBtnAlert" @click="toggleModalAddTime = true" class="btn bg-danger text-white position-relative">
    Waktu Habis
    <span class="position-absolute start-50 tooltip-timer btn-sm bg-white text-dark">Tekan Untuk Tambah Waktu</span>
  </div>
  <span v-else class="badge bg-label-warning me-1"> {{ distance < 0 ? timer.value : `Timer :  ${timer.value}` }}</span>
  <div v-if="toggleModalAddTime" class="modal fade show" id="modalCenter" style="display: block; background-color: var(--bs-gray-dark)">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalCenterTitle">Tambah Meja {{ props.noMeja }}</h5>
          <button type="button" class="btn-close" @click="toggleModalAddTime = false"></button>
        </div>
        <div class="modal-body">
          <div class="d-flex flex-column gap-3">
            <div class="d-flex gap-3">
              <input type="number" class="form-control w-50" min="0" v-model="formTimer.waktu" />
              <div class="d-flex align-items-center justify-content-start gap-3 w-50">
                <h6 class="m-0 text-warning">Total Waktu :</h6>
                <h6 class="m-0">
                  {{ formTimer.waktu >= 60 ? `${Math.floor(formTimer.waktu / 60)} Jam, ${Math.floor(parseInt(formTimer.waktu) - Math.floor(60 * Math.floor(formTimer.waktu / 60)))} Menit` : `${formTimer.waktu} Menit` }}
                </h6>
              </div>
            </div>
            <div class="mt-4 d-flex gap-2 flex-wrap">
              <div class="d-flex gap-3 w-100">
                <button type="button" class="btn btn-outline-secondary w-100" @click="toggleModalAddTime = false">Kembali</button>
                <button @click="updateTime(props.idInvoice)" type="button" class="btn w-100 btn-primary">Tambahkan Sekarang</button>
              </div>
              <button class="btn btn-danger w-100" @click="goHome">PULANG AJA</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
tr,
td {
  text-align: center;
  overflow: visible;
}
.tooltip-timer {
  z-index: 100;
  transform: translate(-50%, 0);
  top: -100%;
  animation: bounch 1s infinite;
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%);
    width: 20px;
    height: 10px;
    border-top: solid 10px white;
    border-left: solid 10px transparent;
    border-right: solid 10px transparent;
  }
}

@keyframes bounch {
  0% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -100%);
  }
  70% {
    transform: translate(-50%, 0);
  }
  85% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-50%, 0);
  }
}
</style>
