<script setup>
import { reactive, ref, onMounted } from 'vue';
import { apiClient, urlApi } from '../api/axios-config';
import swal from 'sweetalert';
import ProfileTop from '../components/ProfileTop.vue';
import { useRouter } from 'vue-router';

let toggleLoadTransaksi = ref(false);
let router = useRouter();
const rowInvoice = reactive({
  items: [],
});
const getInvoice = async () => {
  toggleLoadTransaksi.value = true;
  const { data } = await apiClient.get('/pesanan');
  rowInvoice.items = data.data;
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
  }, 500);
};
const deleteInvoice = async (id, noMeja) => {
  swal({
    title: 'Yakin ?',
    text: `Apakah kamu yakin untuk menghapus transaksi  ini!`,
    icon: 'warning',
    buttons: ['tidak', 'hapus'],
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      const { data } = await apiClient.delete(`/pesanan/${id}`);
      await apiClient.post(`/meja/${noMeja}?_method=PUT`, noMeja);
      swal(`Transaksi berhasil di hapus`, {
        icon: 'success',
      });
      getInvoice();
    }
  });
};

let goToInvoice = (id) => {
  router.push({ name: 'invoice', params: { id: id } });
};
onMounted(() => {
  getInvoice();
});

function addCommas(num) {
  return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
</script>
<template>
  <ProfileTop />

  <h4 class="fw-bold py-3 my-4">
    <span class="text-muted fw-light"><a href="/dashboard" class="text-muted fw-normal">Dashboard </a>/</span> Transaksi
  </h4>

  <div class="card">
    <h5 class="card-header">Transaksi</h5>
    <div class="table-responsive text-nowrap">
      <table class="table">
        <thead>
          <tr>
            <th>No</th>
            <th>id pesanan</th>
            <th>Tempat</th>
            <th>jumlah_pesanan</th>
            <th>total harga</th>
            <th>Tanggal / waktu</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody v-if="toggleLoadTransaksi == false && rowInvoice.items == 0" class="text-dark fw-bold position-relative">
          <div class="alert alert-danger position-absolute top-0 start-50" style="transform: translate(-50%, 50%)">Transaksi Kosong</div>
        </tbody>
        <tbody>
          <tr v-if="toggleLoadTransaksi" class="position-relative">
            <td style="position: absolute; top: 50%; left: 50%; transform: translate(-50%)">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading... </span>
              </div>
            </td>
          </tr>
          <tr v-else v-for="(item, index) in rowInvoice.items" :key="index">
            <td>{{ index + 1 }}</td>
            <td>
              <i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>{{ item.id_pesanan }}</strong>
            </td>
            <td>{{ item.no_meja == '0' ? 'Bawa Pulang' : 'Meja ' + item.no_meja }}</td>
            <td>{{ item.jumlah_pesanan }}</td>
            <td>Rp {{ addCommas(item.total_harga) }}</td>
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
                  <button class="dropdown-item" @click="deleteInvoice(item.id, item.no_meja)"><i class="bx bx-trash me-1"></i> Delete</button>
                  <button class="dropdown-item" @click="goToInvoice(item.id)">Invoice</button>
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
