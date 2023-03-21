<script setup>
import Icons from '../components/Icons.vue';
import { apiClient, urlApi } from '../api/axios-config';
import { onMounted, reactive, ref, computed } from 'vue';
import ProfileTop from '/src/components/ProfileTop.vue';
import swal from 'sweetalert';

let toggleLoadMenu = ref(false);
let togglePopupDetail = ref(false);
let toggleSwitchImgUpdate = ref(false);
let toggleToTable = ref(true);
let toggleToForm = ref(false);
let waitAddMenu = ref(false);
let waitDeleteMenu = ref(false);
let waitUpdateMenu = ref(false);
let activeCat = ref('');

const row = reactive({
  items: [],
});
const rowKategori = reactive({
  items: [],
});
let dataAlert = reactive({
  color: '',
  message: '',
});
let formDataMenu = reactive({
  id_user: '',
  nama: '',
  harga: '',
  cover: '',
  kategori: '',
  deskripsi: '',
});
let dataMenuDetail = reactive({
  id_user: '',
  id: '',
  nama: '',
  harga: '',
  cover: '',
  coverUpdate: '',
  kategori: '',
  deskripsi: '',
});
let setDataMenuDetail = (id, nama, harga, cover, kategori, deskripsi) => {
  dataMenuDetail.id = id;
  dataMenuDetail.nama = nama;
  dataMenuDetail.harga = harga;
  dataMenuDetail.cover = cover;
  dataMenuDetail.kategori = kategori;
  dataMenuDetail.deskripsi = deskripsi;
  togglePopupDetail.value = true;
};

const onInputCoverChange = (e) => {
  formDataMenu.cover = e.target.files[0];
  getImg(e, urlImg);
};
const onInputCoverDetailChange = (e) => {
  dataMenuDetail.coverUpdate = e.target.files[0];
  getImg(e, urlImgUpdate);
  toggleSwitchImgUpdate.value = true;
};
const getKategori = async () => {
  const { data } = await apiClient.get('/kategori');
  rowKategori.items = data.data;
};
const getMenuByCat = async (cat) => {
  toggleLoadMenu.value = true;
  activeCat.value = cat;
  const { data } = await apiClient.get(`/menu/kategori/${cat}`);
  row.items = data.data;
  toggleLoadMenu.value = false;
  if (row.items[0] == null) {
    swal({
      icon: 'warning',
      title: `Menu Dengan Kategori ${cat} sedang kosong`,
      button: true,
    });
    getMenu();
  }
};
const getMenu = async () => {
  toggleLoadMenu.value = true;
  activeCat.value = 'all';
  const { data } = await apiClient.get('/menu');
  row.items = data.data;
  setTimeout(() => {
    toggleLoadMenu.value = false;
  }, 500);
};
const addMenu = async () => {
  waitAddMenu.value = true;
  let harga = parseFloat(formDataMenu.harga.replace(/,/g, ''));
  const fields = new FormData();
  fields.append('id_user', formDataMenu.id_user);
  fields.append('nama', formDataMenu.nama);
  fields.append('harga', harga);
  fields.append('cover', formDataMenu.cover);
  fields.append('kategori', formDataMenu.kategori);
  fields.append('deskripsi', formDataMenu.deskripsi);
  console.log(harga);
  if (formDataMenu.cover == '') {
    swal({
      title: 'Upload Gambar Menu',
      icon: 'warning',
    });
    waitAddMenu.value = false;
  } else if (document.querySelector('#upload').files.length == 0) {
    swal({
      title: 'Upload Ulang Gambar Menu',
      icon: 'warning',
    });
    waitAddMenu.value = false;
  } else {
    const { data } = await apiClient.post('/menu', fields);
    if (data.status) {
      swal({
        title: 'Berhasil',
        text: 'Menu Berhasil Di Tambahkan',
        icon: 'success',
        button: 'Ok',
      });
      waitAddMenu.value = false;
      toggleToForm.value = false;
      toggleToTable.value = true;
      getMenu();
    } else {
      waitAddMenu.value = false;
      swal({
        title: 'Perhatikan',
        text: 'foto menu Harus berformat gambar digital',
        icon: 'warning',
      });
    }
  }
};
const updateMenu = async () => {
  waitUpdateMenu.value = true;
  const fieldsEdit = new FormData();
  fieldsEdit.append('id_user', dataMenuDetail.id_user);
  fieldsEdit.append('nama', dataMenuDetail.nama);
  fieldsEdit.append('harga', dataMenuDetail.harga);
  fieldsEdit.append('cover', dataMenuDetail.coverUpdate);
  fieldsEdit.append('kategori', dataMenuDetail.kategori);
  fieldsEdit.append('deskripsi', dataMenuDetail.deskripsi);
  if (dataMenuDetail.cover == '') {
    swal({
      title: 'Upload Gambar Menu',
      icon: 'warning',
    });
    waitUpdateMenu.value = false;
  } else {
    const { data } = await apiClient.post(`/menu/${dataMenuDetail.id}?_method=PUT`, fieldsEdit);
    if (data.status) {
      togglePopupDetail.value = false;
      toggleSwitchImgUpdate.value = false;
      waitUpdateMenu.value = false;
      getMenu();
      await swal({
        title: 'Berhasil',
        text: 'Menu Berhasil Di Ubah',
        icon: 'success',
        button: 'Ok',
      });
    } else {
      await swal({
        title: 'Perhatikan',
        text: `${data.message}`,
        icon: 'warning',
        button: 'Ok',
        dangerMode: true,
      });
      waitUpdateMenu.value = false;
    }
  }
};
const deleteMenu = async (id) => {
  waitDeleteMenu.value = true;
  waitDeleteMenu.value = true;
  swal({
    title: 'Yakin ?',
    text: `Apakah kamu yakin untuk menghapus menu ${dataMenuDetail.nama}  ini!`,
    icon: 'warning',
    buttons: ['tidak', 'hapus'],
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      const { data } = await apiClient.delete(`/menu/${id}`);
      togglePopupDetail.value = false;
      waitDeleteMenu.value = false;
      swal(`menu ${dataMenuDetail.nama} berhasil di hapus`, {
        icon: 'success',
      });
      getMenu();
    } else {
      waitDeleteMenu.value = false;
    }
  });
};

let urlImg = ref('/src/assets/img/emptyImage.svg');
let urlImgUpdate = ref('/src/assets/img/emptyImage.svg');
let getImg = (e, urlVar) => {
  const files = e.target.files[0];
  if (files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener('load', function () {
      urlVar.value = this.result;
    });
  }
};

let user = JSON.parse(localStorage.getItem('user_data'));
if (user !== null) {
  formDataMenu.id_user = user.id;
  dataMenuDetail.id_user = user.id;
}

let searchQuery = ref('');

let waitSearch = ref(false);
let waitTyping;
let doneTyping;

let onSearch = async () => {
  clearTimeout(waitTyping);
  waitTyping = setTimeout(doneTyping, 500);
};
doneTyping = async () => {
  if (searchQuery.value == ' ' || searchQuery.value == '' || searchQuery.value == null) {
    waitSearch.value = true;
    getMenu();
    waitSearch.value = false;
  } else {
    getMenu();
    waitSearch.value = true;
    let { data } = await apiClient.get(`search-menu/${searchQuery.value}`);
    row.items = data.data;
    if (data.status) {
      waitSearch.value = false;
    } else {
      waitSearch.value = false;
    }
  }
};

onMounted(() => {
  getMenu();
  getKategori();
});

const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');
let onChangeHarga = (value) => {
  formDataMenu.harga = addCommas(removeNonNumeric(value.target.value));
};

function addCommas(num) {
  return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
</script>
<template>
  <ProfileTop />
  <Transition>
    <div v-if="waitSearch" class="position-fixed top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center" style="z-index: 1">
      <div class="d-flex gap-3 p-4 bg-white rounded align-items-center shadow">
        <div class="spinner-border spinner-border-md bg-white"></div>
        <p class="m-0">Mohon Tunggu</p>
      </div>
    </div>
  </Transition>

  <h4 class="fw-bold py-3">
    <span class="text-muted fw-light"> <RouterLink class="text-muted fw-normal" :to="{ name: 'dashboard' }">Dashboard </RouterLink>/</span> Menu
  </h4>
  <div class="d-flex gap-3 mb-3">
    <button @click="(toggleToTable = true), (toggleToForm = false)" class="btn" :class="toggleToTable ? 'btn-primary' : 'shadow-sm'">Menu</button>
    <button @click="(toggleToTable = false), (toggleToForm = true)" class="btn" :class="toggleToForm ? 'btn-primary' : 'shadow-sm'">Form Menu</button>
  </div>
  <form v-if="toggleToForm && toggleToTable == false" @submit.prevent="addMenu()" class="card mb-4">
    <h5 class="card-header">Form Controls</h5>
    <div class="card-body">
      <div class="mb-3">
        <div class="d-flex align-items-start align-items-sm-center gap-4">
          <img :src="urlImg" alt="user-avatar" class="d-block rounded" height="100" width="100" id="uploadedAvatar" style="border: var(--bs-secondary) solid 1px" />
          <div class="button-wrapper">
            <label for="upload" class="btn btn-primary me-2 mb-4" tabindex="0">
              <span class="d-none d-sm-block">Upload photo</span>
              <i class="bx bx-upload d-block d-sm-none"></i>
              <input type="file" v-on:change="onInputCoverChange" name="cover" id="upload" class="account-file-input" hidden="" accept="image/png, image/jpeg" />
            </label>
            <button type="reset" @click="urlImg = '/src/assets/img/emptyImage.svg'" class="btn btn-outline-secondary account-image-reset mb-4">
              <i class="bx bx-reset d-block d-sm-none"></i>
              <span class="d-none d-sm-block">Reset</span>
            </button>

            <p class="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
          </div>
        </div>
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Nama Menu</label>
        <input required type="text" name="nama" v-model="formDataMenu.nama" class="form-control" placeholder="Nama Menu" />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Harga</label>
        <input required type="text" name="harga" :onkeyup="onChangeHarga" :onkeydown="clearTimeout(waitTyping)" v-model="formDataMenu.harga" class="form-control" />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlSelect1" class="form-label">Kategori</label>
        <select class="form-select" name="kategori" required v-model="formDataMenu.kategori">
          <option selected value="">-- Pilih Kategori --</option>
          <option v-for="item in rowKategori.items" :value="item.nama">{{ item.nama }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="exampleFormControlTextarea1" class="form-label">Deskripsi Menu</label>
        <textarea class="form-control" required type="text" name="deskripsi" v-model="formDataMenu.deskripsi" rows="3"></textarea>
      </div>
      <button v-if="waitAddMenu" type="button" class="btn btn-primary"><div class="spinner-border"></div></button>
      <button v-else type="submit" class="btn btn-primary">Tambahkan Menu</button>
    </div>
  </form>

  <div v-if="toggleToTable && toggleToForm == false" class="dashboard-menu d-flex flex-column card px-4 pb-4">
    <div class="d-flex gap-2 align-items-center mt-4 form-control">
      <Icons name="search" height="20px" fill="#697a8d" />
      <input type="text" class="border-0 w-100 text-dark" placeholder="Search..." :onkeyup="onSearch" v-model="searchQuery" style="outline: none" />
    </div>
    <div class="overflow-auto my-4">
      <div class="d-flex gap-3 mb-3">
        <button @click="getMenu(), (searchQuery = '')" :class="activeCat == 'all' && 'btn-dark'" class="btn shadow-sm d-flex gap-1 align-items-center">
          <Icons name="grid" height="20px" fill="#697a8d" />
          <p class="m-0">All</p>
        </button>
        <button v-for="(item, index) in rowKategori.items" :key="index" @click="getMenuByCat(item.nama), (searchQuery = '')" :class="item.nama == activeCat && 'btn-dark'" class="btn shadow-sm d-flex gap-1 align-items-center">
          <img :src="urlApi + item.cover" :alt="item.cover" style="height: 16px; width: 16px" />
          <p class="m-0">{{ item.nama }}</p>
        </button>
      </div>
    </div>

    <div class="d-flex gap-3 flex-wrap">
      <div v-if="row.items.length == 0" class="alert alert-danger">Menu yang anda Cari kosong</div>
      <div class="menu" v-for="item in row.items">
        <div v-if="toggleLoadMenu" class="pre-menu placeholder-glow">
          <div class="pre-menu-top placeholder flex flex-wrap" style="height: 10rem; width: 10rem; margin-bottom: 1rem"></div>
          <div class="pre-menu-bot flex flex-between" style="gap: 2rem">
            <div class="pre-menu-bot-1 placeholder" style="height: 2rem; width: 4rem"></div>
            <div class="pre-menu-bot-2 placeholder" style="height: 2rem; width: 4rem"></div>
          </div>
        </div>
        <div v-if="toggleLoadMenu == false" class="menu-wrapper border" @click="setDataMenuDetail(item.id, item.nama, item.harga, item.cover, item.kategori, item.deskripsi)">
          <div class="menu-wrapper-img asset-bg" :style="{ background: `url(${urlApi + item.cover})` }"></div>
          <div class="d-flex flex-column gap-2">
            <h5 class="m-0">
              {{ item.nama }}
            </h5>
            <h5 class="m-0">Rp {{ addCommas(item.harga) }}</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Transition>
    <div class="modal fade show" v-if="togglePopupDetail" style="display: block; background-color: var(--bs-gray-dark)">
      <div class="modal-dialog modal-dialog-centered">
        <form @submit.prevent="updateMenu()" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCenterTitle">Modal title</h5>
            <button @click="(togglePopupDetail = false), (toggleSwitchImgUpdate = false)" type="button" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <div class="d-flex align-items-start align-items-sm-center gap-4">
                <img :src="toggleSwitchImgUpdate ? urlImgUpdate : urlApi + dataMenuDetail.cover" alt="user-avatar" class="d-block rounded" height="100" width="100" />
                <div class="button-wrapper">
                  <label for="uploadUpdate" class="btn btn-primary me-2 mb-4" tabindex="0">
                    <span class="d-none d-sm-block">Upload new photo</span>
                    <i class="bx bx-upload d-block d-sm-none"></i>
                    <input type="file" v-on:change="onInputCoverDetailChange" id="uploadUpdate" name="cover" class="account-file-input" hidden="" accept="image/png, image/jpeg" />
                  </label>
                  <button v-if="waitDeleteMenu" class="btn btn-danger"><div class="spinner-border"></div></button>
                  <button v-else @click="deleteMenu(dataMenuDetail.id)" type="button" class="btn btn-danger mb-4">
                    <span class="d-none d-sm-block">Hapus Menu</span>
                  </button>

                  <p class="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col mb-3">
                <label for="exampleFormControlInput1" class="form-label">Nama Menu</label>
                <input required type="text" name="nama" v-model="dataMenuDetail.nama" class="form-control" placeholder="Nama Menu" />
              </div>
            </div>
            <div class="row g-2">
              <div class="col mb-0">
                <label for="exampleFormControlInput1" class="form-label">Harga</label>
                <input required type="number" name="harga" v-model="dataMenuDetail.harga" class="form-control" />
              </div>
              <div class="col mb-0">
                <label for="exampleFormControlSelect1" class="form-label">Kategori</label>
                <select class="form-select" name="kategori" required v-model="dataMenuDetail.kategori">
                  <option v-for="item in rowKategori.items" :value="item.nama">{{ item.nama }}</option>
                </select>
              </div>
            </div>
            <div class="col mb-3">
              <label for="exampleFormControlTextarea1" class="form-label">Deskripsi Menu</label>
              <textarea class="form-control" required type="text" name="deskripsi" v-model="dataMenuDetail.deskripsi" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="reset" class="btn btn-outline-secondary" data-bs-dismiss="modal">Reset</button>
            <button v-if="waitUpdateMenu" type="button" class="btn btn-primary"><div class="spinner-border"></div></button>
            <button v-else type="submit" class="btn btn-primary">Save changes</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>
<style lang="scss">
.dashboard-menu {
  display: flex;
  flex-wrap: wrap;
  height: -webkit-fill-available;
  height: 100%;
}
.menu {
  &-wrapper {
    border-radius: 1rem;
    background-color: white;
    box-shadow: 0 60px 44px -49px rgba(grey, 0.2);
    padding: 1rem;
    &-img {
      height: 10rem;
      width: 10rem;
      padding: 1rem;
    }
  }
}
.form-detail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(black, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  &-wrapper {
    width: 70%;
    padding: 2rem 3rem;
    background-color: white;
    border-radius: 0.5rem;
    margin: 5rem;
  }
  &-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & p {
      font-size: 2.4rem;
      color: var(--color-black);
      font-weight: 600;
      text-transform: capitalize;
    }
    & svg {
      cursor: pointer;
      height: 2rem;
    }
  }
  &-info {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 2rem 0;
    &-left {
      &-img {
        height: 12rem;
        width: 12rem;
        background-size: cover !important;
        background-position: center !important;
      }
    }
    &-right {
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
      &-btn {
        display: flex;
        align-items: center;
        gap: 2rem;

        #inputCover {
          display: none;
        }
        label,
        button {
          border-radius: 0.5rem;
          border: none;
          background: unset;
          text-transform: uppercase;
          font-size: 1.6rem;
          font-weight: 500;
          cursor: pointer;
          &:nth-child(1) {
            padding: 1rem 3rem;
            background-color: var(--color-admin-blue);
            color: white;
            box-shadow: 4px 4px 2rem rgba(grey, 0.2);
            border: solid 1px var(--color-admin-blue);
          }
          &:nth-child(3) {
            padding: 1rem 2rem;
            border: rgba(red, 0.5) solid 1px;
            background-color: red;
            color: white;
          }
        }
      }
      &-valid {
      }
    }
  }
  &-fill {
    margin-top: 3rem;
    &-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }
    &-item {
      width: -webkit-fill-available;
      position: relative;
      & label {
        font-size: 1.6rem;
        text-transform: capitalize;
        position: absolute;
        top: -1.4rem;
        left: 1rem;
        padding: 0 1rem;
        background-color: white;
        z-index: 1;
        color: rgba(grey, 0.5);
      }
      & input,
      & select {
        width: -webkit-fill-available;
        padding: 1.6rem;
        border-radius: 0.6rem;
        outline: none;
        border: solid 1px rgba(grey, 0.5);
        font-size: 1.6rem;
        text-transform: capitalize;
        color: var(--color-black);
        font-weight: 500;
        &::placeholder {
          color: rgba(grey, 0.5);
        }
      }
    }
    &-btn {
      margin-top: 3rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 2rem;
      button {
        border-radius: 0.5rem;
        border: none;
        background: unset;
        text-transform: uppercase;
        font-size: 1.6rem;
        font-weight: 500;
        cursor: pointer;
        &:nth-child(1) {
          padding: 1rem 3rem;
          background-color: var(--color-admin-blue);
          color: white;
          box-shadow: 4px 4px 2rem rgba(grey, 0.2);
          border: solid 1px var(--color-admin-blue);
        }
        &:nth-child(2) {
          padding: 1rem 2rem;
          border: rgba(red, 0.5) solid 1px;
          color: red;
        }
      }
    }
  }
}
</style>
