<script setup>
import { reactive, ref, onMounted } from 'vue';
import { apiClient, urlApi } from '../../api/axios-config';
import swal from 'sweetalert';
import ProfileTop from '../../components/ProfileTop.vue';

let toggleLoadTransaksi = ref(false);
const rowInvoice = reactive({
  items: [],
});
const getInvoice = async () => {
  toggleLoadTransaksi.value = true;
  const { data } = await apiClient.get('/invoice');
  rowInvoice.items = data.data;
  setTimeout(() => {
    toggleLoadTransaksi.value = false;
  }, 500);
};
const deleteInvoice = async (id) => {
  swal({
    title: 'Yakin ?',
    text: `Apakah kamu yakin untuk menghapus transaksi  ini!`,
    icon: 'warning',
    buttons: ['tidak', 'hapus'],
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      const { data } = await apiClient.delete(`/invoice/${id}`);
      swal(`Transaksi berhasil di hapus`, {
        icon: 'success',
      });
      getInvoice();
    }
  });
};
onMounted(() => {
  getInvoice();
});
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
          <tr v-else v-for="(item, index) in rowInvoice.items" :key="index">
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
