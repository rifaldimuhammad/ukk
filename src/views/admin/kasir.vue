<script setup>
import { reactive, onMounted, ref } from 'vue';
import ProfileTop from '../../components/ProfileTop.vue';
import { apiClient, urlApi } from '../../api/axios-config';
import Icons from '../../components/Icons.vue';
import ValueJumlah from '../../components/ValueJumlah.vue';
import { useRoute, useRouter } from 'vue-router';
import swal from 'sweetalert';
import { value } from 'dom7';
let router = useRouter();
let route = useRoute();
let toggleLoadMenu = ref(false);
let toggleToCart = ref(false);
let toggleToMenu = ref(true);
let toggleModelJumlah = ref(false);
let toggleModalInvoice = ref(false);
let toggleModalImgMenu = ref(false);
let rowMenu = reactive({
  items: [],
});
const rowKategori = reactive({
  items: [],
});
const rowCart = reactive({
  items: [],
});
let rowInvoice = reactive({
  id: '',
  id_menu: [],
  id_pesanan: [],
  pesanan: [],
  fullJumlah: 0,
  fullTotal: 0,
});
let formAddCart = reactive({
  id_user: 1,
  id_menu: '',
  harga_menu: '',
  jumlah_menu: 1,
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
  const { data } = await apiClient.get(`/pesanan`);
  rowCart.items = data.data;
  rowInvoice.pesanan = data.data;
  rowInvoice.pesanan.map(async (item, index) => {
    rowInvoice.fullJumlah += parseInt(item.jumlah_menu);
    rowInvoice.fullTotal += parseInt(item.total_harga);
    rowInvoice.id_pesanan.push(item.id);
    rowInvoice.id_menu.push(item.id_menu);
  });
  rowCart.items.map(async (e) => {
    arrTotal.total += parseInt(e.total_harga);
  });
};

const addToCart = async () => {
  if (formAddCart.jumlah_menu > 0) {
    const { data } = await apiClient.post('/pesanan', formAddCart);
    console.log(formAddCart);
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
      const { data } = await apiClient.delete(`/pesanan/${id}`);
      swal(`pesanan berhasil di hapus`, {
        icon: 'success',
      });
      getCart();
    }
  });
};

// document.addEventListener('click', (e) => {
//   if (!document.querySelector('.content-popup-img-menu').contains(e.target)) {
//     // $('.modal-content-popup-img-menu').removeClass('trans-modal-invoice-100');
//     console.log(toggleModalImgMenu.value);
//   } else {
//     console.log(toggleModalImgMenu.value);
//   }
// });

onMounted(() => {
  getMenu();
  getCart();
  getKategori();
  if (route.params.category != null) {
    getMenuByCat(route.params.category);
  }
});
</script>
<template>
  <ProfileTop />

  <div class="py-4">
    <div class="d-flex gap-3 mb-3">
      <button @click="(toggleToMenu = true), (toggleToCart = false)" class="btn d-flex gap-1" :class="toggleToMenu ? 'shadow-sm' : 'nav-link'">
        <i class="bx bx-search fs-4 lh-0"></i>
        <p class="m-0">Menu</p>
      </button>
      <button @click="(toggleToCart = true), (toggleToMenu = false)" class="btn d-flex gap-1" :class="toggleToCart ? 'shadow-sm' : 'nav-link'">
        <div class="kasir-cart">
          <Icons name="cart" height="20px" fill="#697a8d" />
        </div>
        <p class="m-0">Cart</p>
      </button>
    </div>

    <div v-if="toggleToMenu && toggleToCart == false" class="card">
      <div class="card-header bg-dark d-flex justify-content-between align-items-center gap-4">
        <h5 class="m-0 text-nowrap text-light">Pesan Menu</h5>
        <div class="bg-dark d-flex gap-1">
          <i class="bx bx-search fs-4 lh-0"></i>
          <input type="text" placeholder="Search..." class="border-0 w-100 bg-dark text-white" />
        </div>
      </div>
      <div class="d-flex gap-3 mx-4 flex-wrap my-4">
        <RouterLink :to="{ name: 'kasir' }" @click="getMenu()" active-class="btn-dark" class="btn btn-outline-dark d-flex gap-1 align-items-center">
          <Icons name="grid" height="20px" fill="#697a8d" />
          <p class="m-0">All</p>
        </RouterLink>
        <RouterLink
          v-for="(item, index) in rowKategori.items"
          :key="index"
          :to="{ name: 'kasirCategory', params: { category: item.nama } }"
          @click="getMenuByCat(item.nama)"
          active-class="btn-dark"
          class="btn btn-outline-dark d-flex gap-1 align-items-center"
        >
          <img :src="urlApi + item.cover" :alt="item.cover" style="height: 16px; width: 16px" />
          <p class="m-0">{{ item.nama }}</p>
        </RouterLink>
      </div>
      <div class="card-body p-4 d-flex gap-3 flex-wrap">
        <div
          v-for="(item, index) in rowMenu.items"
          :key="index"
          @click="(formAddCart.id_menu = item.id), (formAddCart.harga_menu = item.harga), (formAddCart.jumlah_menu = 1), (formAddCart.total_harga = item.harga), (rowPopupImg.cover = item.cover)"
          class="card h-100 shadow-sm d-flex justify-content-center p-4 cursor-pointer"
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
              <h5 class="card-text">Rp {{ item.harga }}.000</h5>
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

    <div v-if="toggleToCart && toggleToMenu == false" class="kasir-cart">
      <div class="card">
        <h5 class="card-header">Table Basic</h5>
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
            <tbody class="table-border-bottom-0">
              <tr v-for="(item, index) in rowCart.items" :key="index">
                <td>
                  <i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>{{ index + 1 }}</strong>
                </td>
                <td>{{ item.nama_menu }}</td>
                <td>Rp {{ item.harga_menu }}.000</td>
                <td>
                  <ValueJumlah :value="item.jumlah_menu" />
                </td>
                <td>Rp {{ item.total_harga }}.000</td>
                <td><div @click="deleteCart(item.id)" class="btn btn-danger">hps</div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-header border-top d-flex justify-content-end gap-4">
          <div class="d-flex align-items-center gap-2">
            <h6 class="m-0 text-warning">Total Jumlah :</h6>
            <h6 class="m-0">{{ rowInvoice.fullJumlah }} Menu</h6>
          </div>
          <div class="d-flex align-items-center gap-2">
            <h6 class="m-0 text-warning">Total Harga :</h6>
            <h6 class="m-0">Rp {{ rowInvoice.fullTotal }}.000</h6>
          </div>
        </div>
      </div>
      <div class="d-flex my-4 gap 2">
        <button class="btn btn-primary" @click="toggleModalInvoice = true">Konfirmasi Pesanan</button>
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
                <button @click="formAddCart.jumlah_menu--" class="btn btn-primary">-</button>
                <h5 class="m-0">{{ formAddCart.jumlah_menu }}</h5>
                <button @click="formAddCart.jumlah_menu++" class="btn btn-primary">+</button>
              </div>
              <div class="d-flex align-items-center gap-3">
                <h6 class="m-0 text-warning">Total Harga :</h6>
                <h6 class="m-0">Rp {{ formAddCart.harga_menu * formAddCart.jumlah_menu }}.000</h6>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" @click="toggleModelJumlah = false">Kembali</button>
            <button @click="addToCart()" type="button" class="btn btn-primary">Pesan</button>
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
</style>
