<script setup>
import { onMounted, reactive, ref } from 'vue';
import { apiClient, urlApi } from '../../api/axios-config';
import ProfileTop from '../../components/profileTop.vue';
let toggleActionTable = ref(false);
let toggleLoadCat = ref(false);
const rowKategori = reactive({
  items: [],
});
const getKategori = async () => {
  const { data } = await apiClient.get('/kategori');
  rowKategori.items = data.data;
};
onMounted(() => {
  getKategori();
});
</script>
<template>
  <ProfileTop />
  <h4 class="fw-bold py-3 my-4">
    <span class="text-muted fw-light"><a href="/dashboard" class="text-muted fw-normal">Dashboard </a>/</span> Kategori Menu
  </h4>
  <div class="card">
    <h5 class="card-header">Data Kategori Menu</h5>
    <div class="table-responsive text-nowrap">
      <table class="table">
        <thead>
          <tr>
            <th>id</th>
            <th>Nama Kategori</th>
            <th>Image</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in rowKategori.items" :key="index" v-if="toggleLoadCat == false">
            <td>{{ item.id }}</td>
            <td>
              <i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>{{ item.nama }}</strong>
            </td>
            <td><img :src="urlApi + item.cover" class="img-fluid" :alt="urlApi + item.cover" style="width: 50px; padding: 5px" /></td>
            <td><span class="badge bg-label-primary me-1">Active</span></td>
            <td>
              <div class="dropdown">
                <button @click="toggleActionTable = true" type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                  <i class="bx bx-dots-vertical-rounded"></i>
                </button>
                <div class="dropdown-menu">
                  <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-edit-alt me-1"></i> Edit</a>
                  <a class="dropdown-item" href="javascript:void(0);"><i class="bx bx-trash me-1"></i> Delete</a>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style lang="scss" scoped>
th,
td {
  text-align: center;
}

.dropdown-menu.show {
  position: absolute;
  inset: 0px 0px auto auto;
  margin: 0px;
  transform: translate3d(-96px, 27.2px, 0px);
  display: block;
}
</style>
