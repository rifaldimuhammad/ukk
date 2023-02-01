<script setup>
import { onMounted, reactive, ref } from 'vue';
import { apiClient, urlApi } from '../../api/axios-config';
import ProfileTop from '../../components/profileTop.vue';
import swal from 'sweetalert';
let toggleActionTable = ref(false);

let toggleLoadCat = ref(false);
const rowKategori = reactive({
  items: [],
});
let formAddkategori = reactive({
  cover: '',
  nama: '',
});
let onCoverChangeKategori = (e) => {
  let path = (formAddkategori.cover = e.target.files[0]);
  getImg(e);
};
const getKategori = async () => {
  const { data } = await apiClient.get('/kategori');
  rowKategori.items = data.data;
};
const addKategori = async () => {
  let field = new FormData();
  field.append('nama', formAddkategori.nama);
  field.append('cover', formAddkategori.cover);
  const { data } = await apiClient.post('/kategori', field);
  swal({
    icon: 'success',
    title: `Kategori ${formAddkategori.nama} berhasil di tambahkan`,
  });
  getKategori();
};
const deleteKategori = async (id) => {
  swal({
    title: 'Yakin ?',
    text: `Apakah kamu yakin untuk menghapus menu ${id}  ini!`,
    icon: 'warning',
    buttons: ['tidak', 'hapus'],
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      const { data } = await apiClient.delete(`/kategori/${id}`);
      swal(`menu ${id} berhasil di hapus`, {
        icon: 'success',
      });
      getKategori();
    }
  });
};

let urlImg = ref('/src/assets/img/emptyImage.svg');
let getImg = (e) => {
  const files = e.target.files[0];
  if (files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener('load', function () {
      urlImg.value = this.result;
    });
  }
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
  <form @submit.prevent="addKategori()" class="card mb-4">
    <h5 class="card-header">Form Controls</h5>
    <div class="card-body">
      <div class="mb-3">
        <div class="d-flex align-items-start align-items-sm-center gap-4">
          <img :src="urlImg" alt="user-avatar" class="d-block rounded" height="100" width="100" id="uploadedAvatar" style="border: var(--bs-secondary) solid 1px" />
          <div class="button-wrapper">
            <label for="upload" class="btn btn-primary me-2 mb-4" tabindex="0"
              ><span class="d-none d-sm-block">Upload new photo</span><i class="bx bx-upload d-block d-sm-none"></i
              ><input type="file" name="cover" id="upload" v-on:change="onCoverChangeKategori" class="account-file-input" hidden="" accept="image/png, image/jpeg" /></label
            ><button type="reset" @click="urlImg = '/src/assets/img/emptyImage.svg'" class="btn btn-outline-secondary account-image-reset mb-4">
              <i class="bx bx-reset d-block d-sm-none"></i><span class="d-none d-sm-block">Reset</span>
            </button>
            <p class="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
          </div>
        </div>
      </div>
      <div class="mb-3"><label for="exampleFormControlInput1" class="form-label">Nama Kategori</label><input v-model="formAddkategori.nama" required="" type="text" name="nama" class="form-control" placeholder="Nama Kategori" /></div>
      <button type="submit" class="btn btn-primary">Tambahkan Kategori</button>
    </div>
  </form>
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
                  <button class="dropdown-item"><i class="bx bx-edit-alt me-1"></i> Edit</button>
                  <button class="dropdown-item" @click="deleteKategori(item.id)"><i class="bx bx-trash me-1"></i> Delete</button>
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
