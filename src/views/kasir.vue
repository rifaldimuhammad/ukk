<script setup>
import { reactive, onMounted, ref } from 'vue';
import ProfileTop from '../components/ProfileTop.vue';
import { apiClient, urlApi } from '../api/axios-config';
import Icons from '../components/Icons.vue';
import ValueJumlah from '../components/ValueJumlah.vue';
import { useRoute, useRouter } from 'vue-router';
import swal from 'sweetalert';
let router = useRouter();
let route = useRoute();
let toggleLoadMenu = ref(false);
let toggleToMeja = ref(false);
let toggleToCart = ref(false);
let toggleToMenu = ref(true);
let toggleModelJumlah = ref(false);
let toggleModalInvoice = ref(false);
let toggleModalImgMenu = ref(false);
let toggleModalSelectMeja = ref(false);
let waitAddPesanan = ref(false);
let rowMenu = reactive({
  items: [],
});
const rowKategori = reactive({
  items: [],
});
const rowCart = reactive({
  items: [],
});
const rowMeja = reactive({
  items: [],
});
let rowInvoice = reactive({
  id: '',
  id_menu: [],
  pesanan: [],
  fullJumlah: 0,
  fullTotal: 0,
  no_meja: 0,
  tunai: 0,
  waktu: 1,
});
const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, '');
let onChangeTunai = (value) => {
  rowInvoice.tunai = addCommas(removeNonNumeric(value.target.value));
};

let formAddCart = reactive({
  id_user: 1,
  id_menu: '',
  harga_menu: '',
  jumlah_menu: 0,
  total_harga: '',
});

let arrTotal = reactive({
  total: 0,
});
let rowPopupImg = reactive({ cover: '' });

const getMenu = async () => {
  toggleLoadMenu.value = true;
  const { data } = await apiClient.get('/menu');
  rowMenu.items = data.data;
  setTimeout(() => {
    toggleLoadMenu.value = false;
  }, 500);
};

let formAddMeja;
const getMeja = async () => {
  let { data } = await apiClient.get('/meja');
  rowMeja.items = data.data;
  formAddMeja = reactive({
    option: 'meja',
    status: 'null',
    no_meja: rowMeja.items.length,
  });
};

const addMeja = async () => {
  swal({
    title: 'Yakin ?',
    text: `Tambahkan Satu Meja Lagi?`,
    icon: 'warning',
    buttons: ['Kembali', 'Tambahkan'],
    // dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      let { data } = await apiClient.post('/meja', formAddMeja);
      swal(`1 Meja ditambahkan`, {
        icon: 'success',
      });
      getMeja();
    }
  });
};

const getMenuByCat = async (cat) => {
  await router.push({ name: 'kasirCategory', params: { category: cat } });
  toggleLoadMenu.value = true;
  const { data } = await apiClient.get(`/menu/kategori/${route.params.category}`);
  rowMenu.items = data.data;
  toggleLoadMenu.value = false;
  if (rowMenu.items[0] == null) {
    swal({
      icon: 'warning',
      title: `Menu Dengan Kategori ${cat} sedang kosong`,
      button: true,
    });
    await router.push({ name: 'kasir' });
    getMenu();
  }
};
const getKategori = async () => {
  const { data } = await apiClient.get('/kategori');
  rowKategori.items = data.data;
};
const getCart = async () => {
  const { data } = await apiClient.get(`/keranjang`);
  rowCart.items = data.data;
  rowInvoice.pesanan = data.data;
  rowInvoice.fullJumlah = 0;
  rowInvoice.fullTotal = 0;
  rowInvoice.id_menu = [];
  rowInvoice.pesanan.map((item, index) => {
    rowInvoice.fullJumlah += parseInt(item.jumlah_menu);
    rowInvoice.fullTotal += parseInt(item.total_harga);

    if (!rowInvoice.id_menu.includes(item.id_menu)) {
      rowInvoice.id_menu.push(item.id_menu);
    }
  });
  rowCart.items.map(async (e) => {
    arrTotal.total += parseInt(e.total_harga);
  });
};

let rowLastPesanan = reactive([]);
let getLastPesanan = async () => {
  let { data } = await apiClient.get('/pesanan/getLastAdd');
  rowLastPesanan = data.data;
};

const addToCart = async () => {
  if (formAddCart.jumlah_menu > 0) {
    const { data } = await apiClient.post('/keranjang', formAddCart);
    swal({
      icon: 'success',
      title: `${formAddCart.jumlah_menu} menu  berhasil di tambahkan `,
    });
    getCart();
    toggleModelJumlah.value = false;
    toggleToCart.value = true;
    toggleToMenu.value = false;
  } else {
    swal({
      icon: 'warning',
      title: `Jumlah Menu Tidak Boleh Kosong`,
    });
  }
};
const deleteCart = async (id) => {
  swal({
    title: 'Yakin ?',
    text: `Apakah kamu yakin untuk menghapus pesanan  ini!`,
    icon: 'warning',
    buttons: ['tidak', 'hapus'],
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      const { data } = await apiClient.delete(`/keranjang/${id}`);
      swal(`pesanan berhasil di hapus`, {
        icon: 'success',
      });
      rowInvoice.fullJumlah = 0;
      rowInvoice.fullTotal = 0;
      getCart();
    }
  });
};

const addInvoice = async () => {
  let tunai = parseFloat(rowInvoice.tunai.replace(/,/g, ''));
  const field = new FormData();
  field.append('id_menu', rowInvoice.id_menu);
  field.append('jumlah_pesanan', rowInvoice.fullJumlah);
  field.append('total_harga', rowInvoice.fullTotal);
  field.append('tunai', tunai);
  field.append('no_meja', rowInvoice.no_meja);
  field.append('waktu', rowInvoice.waktu);
  if (rowInvoice.no_meja == 0) {
    if (rowInvoice.fullTotal > tunai) {
      swal({
        icon: 'warning',
        title: 'Perhatikan',
        text: 'Tunai kurang dari total menu',
      });
    } else {
      waitAddPesanan.value = true;
      let { data } = await apiClient.post('/pesanan', field);
      toggleModalSelectMeja.value = false;
      waitAddPesanan.value = false;
      await swal({
        icon: 'success',
        title: 'Berhasil',
        text: 'Psanan Berhasil Di Konfirmasi',
      });
      await clearCart();
      await getLastPesanan();
      router.push({ name: 'invoice', params: { id: rowLastPesanan[0].id } });
    }
  } else {
    if (rowInvoice.fullTotal > tunai) {
      swal({
        icon: 'warning',
        title: 'Perhatikan',
        text: 'Tunai kurang dari total menu',
      });
    } else {
      waitAddPesanan.value = true;
      let { data } = await apiClient.post('/pesanan', field);
      toggleModalSelectMeja.value = false;
      waitAddPesanan.value = false;
      await swal({
        icon: 'success',
        title: 'Berhasil',
        text: 'Psanan Berhasil Di Konfirmasi',
      });
      await clearCart();
      await getLastPesanan();
      router.push({ name: 'invoice', params: { id: rowLastPesanan[0].id } });
    }
  }
};

let clearCart = async () => {
  swal({
    icon: 'warning',
    title: 'Perhatikan',
    text: 'Kosongkan Keranjang ?',
    buttons: ['Tidak', 'Kosongkan'],
    dangerMode: true,
  }).then(async (willNull) => {
    if (willNull) {
      let { data } = await apiClient.delete('destroyCart');
      swal({
        icon: 'success',
        title: 'Berhasil',
        text: 'Keranjang Berhasil Di ksongkan',
      });
      getCart();
    }
  });
};

let toggleFocusSearch = ref(false);
let searchQuery = ref('');
let waitSearch = ref(false);

onMounted(() => {
  getMenu();
  getCart();
  getMeja();
  getKategori();

  if (route.params.category != null) {
    getMenuByCat(route.params.category);
  }
});

function trimStr(str) {
  if (!str) return str;
  return str.replace(/^\s+$/g, '');
}

let doSearch = async (event) => {
  searchQuery.value = trimStr(searchQuery.value);
  searchQuery.value = searchQuery.value.replace(/\/+$/, '');
  searchQuery.value = searchQuery.value.replace(/\\/g, '');
  searchQuery.value = searchQuery.value.split('.').join('');
  if (event.key == 'Enter') {
    if (searchQuery.value == '' || searchQuery.value == null) {
      getMenu();
    } else {
      router.push({ name: 'kasir' });
      waitSearch.value = true;
      let { data } = await apiClient.get(`search-menu/${searchQuery.value}`);
      rowMenu.items = data.data;
      waitSearch.value = false;
    }
  }
};
let keyPressed = {};
addEventListener('keydown', function (e) {
  keyPressed[e.key] = true;
  if (keyPressed['Control'] && e.key == '/') {
    toggleFocusSearch.value = true;
    this.document.querySelector('.search-input').focus({ focusVisible: true });
  }
});

addEventListener('keyup', function (event) {
  doSearch(event);
  delete keyPressed[event.key];
});

addEventListener('click', function (e) {
  if (e.target.classList.contains('search-input') || e.target.classList.contains('search-btn')) {
    toggleFocusSearch.value = true;
    this.document.querySelector('.search-input').focus({ focusVisible: true });
  } else {
    toggleFocusSearch.value = false;
  }
});

function addCommas(num) {
  return num.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}
</script>
<template>
  <ProfileTop />
  <Transition>
    <div v-if="waitSearch" class="position-fixed top-0 start-0 h-100 w-100 d-flex align-items-center justify-content-center" style="z-index: 1">
      <div class="d-flex gap-3 p-3 bg-white rounded align-items-center shadow">
        <div class="spinner-border spinner-border-md bg-white"></div>
        <p class="m-0">Mohon Tunggu</p>
      </div>
    </div>
  </Transition>
  <div class="py-4">
    <div class="d-flex gap-3 mb-3">
      <button @click="(toggleToMenu = true), (toggleToMeja = false), (toggleToCart = false), getMenu()" class="btn d-flex gap-1" :class="toggleToMenu ? 'shadow-sm' : 'nav-link'">
        <Icons name="grid" height="20px" fill="#697a8d" />
        <p class="m-0">Menu</p>
      </button>
      <button @click="(toggleToCart = true), (toggleToMeja = false), (toggleToMenu = false), getCart()" class="btn d-flex gap-1" :class="toggleToCart ? 'shadow-sm' : 'nav-link'">
        <div class="kasir-cart">
          <Icons name="cart" height="20px" fill="#697a8d" />
        </div>
        <p class="m-0">Keranjang</p>
      </button>
      <button @click="(toggleToMeja = true), (toggleToCart = false), (toggleToMenu = false), getMeja()" class="btn d-flex gap-1" :class="toggleToMeja ? 'shadow-sm' : 'nav-link'">
        <div class="kasir-cart">
          <Icons name="garpu" height="20px" fill="#697a8d" />
        </div>
        <p class="m-0">Meja</p>
      </button>
    </div>

    <!-- ///////////MENU SECTION/////////////////////////
    ////////////////////////////////////////////////// -->

    <div v-if="toggleToMenu && toggleToCart == false && toggleToMeja == false" class="card">
      <div class="card-header bg-dark d-flex justify-content-between align-items-center gap-4">
        <h5 class="m-0 text-nowrap text-white">Pesan Menu</h5>
        <div class="d-flex gap-2 align-items-center form-control search-container" :class="toggleFocusSearch ? 'bg-light border-dark' : ' bg-dark '" :style="toggleFocusSearch ? 'width: 100%' : 'width: 250px'">
          <input type="text" class="border-0 w-100 search-input" :class="toggleFocusSearch ? 'bg-light text-dark' : ' bg-dark text-white'" placeholder="Search..." v-model="searchQuery" style="outline: none" />
          <div @click="doSearch" class="cursor-pointer search-btn">
            <Icons name="search" height="20px" fill="#697a8d" />
          </div>
          <div class="d-flex">
            <div class="btn btn-xs bg-label-dark">Ctrl</div>
            <p class="m-0">+</p>
            <div class="btn btn-xs bg-label-dark">/</div>
          </div>
        </div>
      </div>
      <div class="overflow-auto mx-4 my-4">
        <div class="d-flex gap-3 mb-3">
          <RouterLink :to="{ name: 'kasir' }" @click="getMenu(), (searchQuery = '')" :class="route.name == 'kasir' && 'btn-dark'" class="btn shadow-sm d-flex gap-1 align-items-center">
            <Icons name="grid" height="20px" fill="#697a8d" />
            <p class="m-0">All</p>
          </RouterLink>
          <RouterLink
            v-for="(item, index) in rowKategori.items"
            :key="index"
            :to="{ name: 'kasirCategory', params: { category: item.nama } }"
            @click="getMenuByCat(item.nama), (searchQuery = '')"
            active-class="btn-dark"
            class="btn shadow-sm d-flex gap-1 align-items-center"
          >
            <img :src="urlApi + item.cover" :alt="item.cover" style="height: 16px; width: 16px" />
            <p class="m-0">{{ item.nama }}</p>
          </RouterLink>
        </div>
      </div>
      <div class="card-body p-4 d-flex gap-3 flex-wrap">
        <div v-if="rowMenu.items.length == 0 && waitSearch == false && toggleLoadMenu == false" class="alert alert-danger">Menu yang anda Cari kosong</div>
        <div
          v-for="(item, index) in rowMenu.items"
          :key="index"
          @click="(formAddCart.id_menu = item.id), (formAddCart.harga_menu = item.harga), (formAddCart.jumlah_menu = 1), (formAddCart.total_harga = item.harga), (rowPopupImg.cover = item.cover)"
          class="card menus h-100 border d-flex justify-content-center p-4 cursor-pointer"
          style="width: fit-content"
        >
          <div v-if="toggleLoadMenu" class="pre-menu d-flex flex-column gap-3">
            <div class="pre-menu-img loader-content" style="height: 150px; width: 150px"></div>
            <div class="pre-menu-bot loader-content" style="height: 30px; width: 100%"></div>
          </div>
          <div v-else class="d-flex flex-column">
            <div class="card-img-top" @click="toggleModalImgMenu = true" :style="{ background: `url(${urlApi + item.cover})` }"></div>
            <div class="mt-3">
              <p class="card-title text-dark">{{ item.nama }}</p>
              <h5 class="card-text">Rp {{ addCommas(item.harga) }}</h5>
              <button @click="toggleModelJumlah = true" class="btn btn-outline-primary w-100">Beli</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- popup img menu -->
    <div
      class="modal-content h-100 fixed-top modal-content-popup-img-menu"
      :class="toggleModalImgMenu ? 'trans-modal-invoice-0' : 'trans-modal-invoice-100'"
      style="z-index: 2000; transition: all 0.3s cubic-bezier(0.83, 0, 0.17, 1); background: rgba(0, 0, 0, 0.3)"
      @click="toggleModalImgMenu = false"
    >
      <div class="modal-body d-flex justify-content-center align-items-center" style="overflow: auto">
        <img class="img-fluid w-50 content-popup-img-menu" :src="urlApi + rowPopupImg.cover" :alt="urlApi + rowPopupImg.cover" />
      </div>
    </div>

    <div v-if="toggleModelJumlah" class="modal fade show" id="modalCenter" style="display: block; background-color: var(--bs-gray-dark)">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCenterTitle">Masukan Jumlah Menu</h5>
            <button type="button" class="btn-close" @click="toggleModelJumlah = false"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex justify-content-between gap-3">
              <div class="d-flex align-items-center gap-3">
                <button v-if="formAddCart.jumlah_menu > 0" @click="formAddCart.jumlah_menu--" class="btn btn-primary">-</button>
                <button v-else class="btn btn-primary">-</button>
                <h5 class="m-0">{{ formAddCart.jumlah_menu }}</h5>
                <button @click="formAddCart.jumlah_menu++" class="btn btn-primary">+</button>
              </div>
              <div class="d-flex align-items-center gap-3">
                <h6 class="m-0 text-warning">Total Harga :</h6>
                <h6 class="m-0">Rp {{ addCommas(formAddCart.harga_menu * formAddCart.jumlah_menu) }}</h6>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="toggleModelJumlah = false">Kembali</button>
            <button @click="addToCart()" type="button" class="btn btn-primary">Tambahkan Ke Keranjang</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ///////////CART SECTION/////////////////////////
    ////////////////////////////////////////////////// -->

    <div v-if="toggleToCart && toggleToMenu == false && toggleToMeja == false" class="kasir-cart">
      <div class="card">
        <div class="d-flex card-header align-items-center justify-content-between bg-dark">
          <h5 class="text-white">Keranjang Pesanan</h5>
          <button @click="clearCart" class="btn btn-danger">Kosongkan Keranjang</button>
        </div>
        <div class="table-responsive text-nowrap">
          <table class="table">
            <thead class="table-dark">
              <tr>
                <th>No</th>
                <th>Nama Menu</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody v-if="rowCart.items.length == 0" class="text-dark fw-bold position-relative">
              <div class="alert alert-danger position-absolute top-0 start-50" style="transform: translate(-50%, 50%)">Keranjang Kosong!, Tambahkan Di Menu Pesanan</div>
            </tbody>
            <tbody v-else class="table-border-bottom-0">
              <tr v-for="(item, index) in rowCart.items" :key="index">
                <td>
                  <i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>{{ index + 1 }}</strong>
                </td>
                <td>{{ item.nama_menu }}</td>
                <td>Rp {{ item.harga_menu }}</td>
                <td><ValueJumlah @update-value="getCart" :defaultValue="item.jumlah_menu" :form="item" /></td>
                <td>Rp {{ addCommas(item.total_harga) }}</td>
                <td>
                  <div @click="deleteCart(item.id)" class="btn btn-danger"><Icons name="trash" fill="white" height="20px" /></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-header border-top d-flex justify-content-end gap-4">
          <div class="d-flex align-items-center gap-2">
            <h6 class="m-0 text-warning">Jumlah Menu :</h6>
            <h6 class="m-0">{{ rowInvoice.fullJumlah }} Menu</h6>
          </div>
          <div class="d-flex align-items-center gap-2">
            <h6 class="m-0 text-warning">Total Harga :</h6>
            <h6 class="m-0">Rp {{ addCommas(rowInvoice.fullTotal) }}</h6>
          </div>
        </div>
      </div>
      <div class="d-flex my-4 gap 2">
        <button class="btn btn-primary" @click="rowCart.items.length == 0 ? swal({ icon: 'warning', title: 'Keranjang Kosong' }) : (toggleModalSelectMeja = true)">Konfirmasi Pesanan</button>
      </div>
    </div>

    <div v-if="toggleModalSelectMeja" class="modal fade show" id="modalCenter" style="display: block; background-color: var(--bs-gray-dark)">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalCenterTitle">Meja & Waktu</h5>
            <button type="button" class="btn-close" @click="toggleModalSelectMeja = false"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-column gap-2 mb-3">
              <h6 class="m-0">Pilih Meja</h6>
              <select class="form-control cursor-pointer" v-model="rowInvoice.no_meja">
                <option v-for="(item, index) in rowMeja.items" :key="index" :value="item.no_meja" :class="item.status == 'notnull' ? 'd-none' : 'd-block'">
                  {{ item.option == 'bawa_pulang' ? 'bawa Pulang' : 'Meja' }} {{ item.no_meja == '0' ? ' ' : item.no_meja }}
                </option>
              </select>
            </div>
            <div v-if="rowInvoice.no_meja != 0" class="d-flex flex-column gap-2 mb-3">
              <h6 class="m-0">Pilih Waktu <span class="text-warning">(menit)</span></h6>
              <div class="d-flex gap-3">
                <input type="number" class="form-control w-50" min="1" v-model="rowInvoice.waktu" />
                <div class="d-flex align-items-center justify-content-start gap-3 w-50">
                  <h6 class="m-0 text-warning">Total Waktu :</h6>
                  <h6 class="m-0">
                    {{ rowInvoice.waktu >= 60 ? `${Math.floor(rowInvoice.waktu / 60)} Jam, ${Math.floor(parseInt(rowInvoice.waktu) - Math.floor(60 * Math.floor(rowInvoice.waktu / 60)))} Menit` : `${rowInvoice.waktu} Menit` }}
                  </h6>
                </div>
              </div>
            </div>
            <div class="d-flex flex-column gap-2 mb-3">
              <h6 class="m-0">Masukan Tunai</h6>
              <input type="text" class="form-control" :oninput="onChangeTunai" v-on:change="onChangeTunai" v-model="rowInvoice.tunai" required min="1" />
            </div>
            <div class="d-flex gap-4">
              <div class="d-flex align-items-center gap-2">
                <h6 class="m-0 text-warning">Jumlah Menu :</h6>
                <h6 class="m-0">{{ rowInvoice.fullJumlah }} Menu</h6>
              </div>
              <div class="d-flex align-items-center gap-2">
                <h6 class="m-0 text-warning">Total Harga :</h6>
                <h6 class="m-0">Rp {{ addCommas(rowInvoice.fullTotal) }}</h6>
              </div>
            </div>
            <div class="mt-5 d-flex gap-3">
              <button type="button" class="btn btn-outline-secondary w-100 bg-secondary text-white" @click="toggleModalSelectMeja = false">Kembali</button>
              <button v-if="waitAddPesanan" type="button" class="btn btn-primary w-100">
                <div class="spinner-border"></div>
              </button>
              <button v-else @click="rowInvoice.tunai == '0' || rowInvoice.tunai == '' ? swal({ icon: 'warning', title: 'Tunai Kosong' }) : addInvoice()" type="button" class="btn btn-primary w-100">Pesan Sekarang</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-content h-100 fixed-top" :class="toggleModalInvoice ? 'trans-modal-invoice-0' : 'trans-modal-invoice-100'" style="z-index: 2000; transition: all 0.3s cubic-bezier(0.83, 0, 0.17, 1)">
      <div class="modal-header">
        <h5 class="modal-title" id="modalFullTitle">Modal title</h5>
        <button type="button" class="btn-close" @click="toggleModalInvoice = false"></button>
      </div>
      <div class="modal-body" style="overflow: auto"></div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" @click="toggleModalInvoice = false">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>

    <!-- ///////////MEJA SECTION/////////////////////////
    ////////////////////////////////////////////////// -->

    <div v-if="toggleToCart == false && toggleToMenu == false && toggleToMeja" class="card">
      <div class="card-header bg-dark d-flex justify-content-between align-items-center">
        <h5 class="text-white m-0">Meja</h5>
        <div class="d-flex gap-3">
          <div class="d-flex gap-3">
            <div class="btn btn-success"></div>
            <p class="m-0 text-white">: Meja Terisi</p>
          </div>
          <div class="d-flex gap-3">
            <div class="btn bg-white"></div>
            <p class="m-0 text-white">: Meja Kosong</p>
          </div>
        </div>
        <button class="btn btn-primary" @click="addMeja">Tambah 1 Meja</button>
      </div>
      <div class="card-body d-flex gap-4 pt-4 flex-wrap justify-content-start">
        <div class="meja" v-for="(item, index) in rowMeja.items" :key="index">
          <div class="m-0 shadow-sm btn btn-xl fw-bold position-relative overflow-hidden" :class="item.status == 'notnull' ? 'bg-success text-white' : 'bg-white'" v-if="item.no_meja > 0">
            <h6 class="m-0 meja-hovered position-absolute top-0 end-0 h-100 w-100 d-flex align-items-center justify-content-center" :class="item.status == 'notnull' ? 'bg-success text-white' : 'bg-white'">
              {{ item.status == 'notnull' ? 'Terisi' : 'Kosong' }}
            </h6>
            <h3 class="m-0" :class="item.status == 'notnull' && 'text-white'">
              {{ item.no_meja }}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.card-img-top {
  height: 150px;
  width: 150px !important;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}
input {
  outline: none;
}
td,
th {
  text-align: center !important;
}
.trans-modal-invoice {
  &-100 {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-100%) scale(0);
  }
  &-0 {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
  }
}
.meja-hovered {
  z-index: 1;
  opacity: 0;
  visibility: 0;
  transition: all 0.3s;
  &:hover {
    opacity: 1;
    visibility: visible;
  }
}
.search-container {
  transition: all 0.3s;
}
</style>
