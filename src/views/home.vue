<script setup>
import SlideHome from '../components/SlideHome.vue';
import Icons from '../components/Icons.vue';
import Menus from '../components/Menus.vue';
import { apiClient, urlApi } from '../api/axios-config';
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '../components/Header.vue';
import swal from 'sweetalert';
let router = useRouter();
let route = useRoute();

let goDetail = (id, name) => {
  router.push({ name: 'detailMenu', params: { id: id, name: name } });
};

let toggleLoadMenu = ref(false);
let togglePopupDetail = ref(false);
let toggleMenuEmpty = ref(false);

const row = reactive({
  items: [],
});
const rowKategori = reactive({
  items: [],
});
const rowCart = reactive({
  items: [],
});

let popupDetailData = reactive({
  id: '',
  nama: '',
  harga: 0,
  cover: '',
  jumlah: 1,
  total: 0,
});
let formAddCart = reactive({
  id_menu: '',
  id_user: '',
  harga: '',
  jumlah_menu: '',
  total_harga: '',
});
const getMenu = async () => {
  toggleLoadMenu.value = true;
  const { data } = await apiClient.get('/menu');
  row.items = data.data;
  setTimeout(() => {
    toggleLoadMenu.value = false;
  }, 500);
};
const getKategori = async () => {
  const { data } = await apiClient.get('/kategori');
  rowKategori.items = data.data;
};
const getCart = async () => {
  const { data } = await apiClient.get(`/pesanan`);
  rowCart.items = data.data;
  rowCart.items.map(async (e) => {});
};
const getMenuByCat = async (cat) => {
  await router.push({ name: 'homeCategory', params: { category: cat } });
  toggleLoadMenu.value = true;
  const { data } = await apiClient.get(`/menu/kategori/${route.params.category}`);
  row.items = data.data;
  if (row.items[0] == null) {
    toggleMenuEmpty.value = true;
  }
  setTimeout(() => {
    toggleLoadMenu.value = false;
  }, 1000);
};

const addToCart = async () => {
  formAddCart.id_menu = popupDetailData.id;
  formAddCart.id_user = 1;
  formAddCart.harga_menu = popupDetailData.harga;
  formAddCart.jumlah_menu = popupDetailData.jumlah;
  formAddCart.total_harga = popupDetailData.harga;

  if (formAddCart.jumlah_menu > 0) {
    const { data } = await apiClient.post('/pesanan', formAddCart);
    swal({
      icon: 'success',
      title: `${popupDetailData.jumlah} menu ${popupDetailData.nama} berhasil di tambahkan `,
    });
    getCart();
  } else {
    swal({
      icon: 'warning',
      title: `Jumlah Menu Tidak Boleh Kosong`,
    });
  }
};

onMounted(() => {
  getCart();
  getMenu();
  getKategori();
  if (route.params.category != null) {
    getMenuByCat(route.params.category);
  }
});
</script>
<template>
  <Header :total-cart="rowCart.items.length"></Header>
  <div class="home">
    <div class="home-wrapper">
      <div class="home-hero">
        <SlideHome />
      </div>
      <div class="title-link">
        <div class="title-link-wrapper">
          <div class="title-link-wrapper-text">top categories</div>
        </div>
      </div>
      <div class="home-cat">
        <div class="home-cat-wrapper">
          <RouterLink :to="{ name: 'home' }" class="home-cat-wrapper-item clear" @click="getMenu()">
            <p>Clear</p>
          </RouterLink>
          <RouterLink v-for="item in rowKategori.items" :to="{ name: 'homeCategory', params: { category: item.nama } }" active-class="active" class="home-cat-wrapper-item" @click="getMenuByCat(item.nama)">
            <div class="home-cat-wrapper-item-img">
              <img :src="urlApi + item.cover" alt="" />
            </div>
            <p>{{ item.nama }}</p>
          </RouterLink>
        </div>
      </div>
      <div class="title-link">
        <div class="title-link-wrapper">
          <div class="title-link-wrapper-text">top categories</div>
          <div class="title-link-wrapper-link">View All <Icons name="right" /></div>
        </div>
      </div>
      <div class="home-menu">
        <div class="menu" v-for="item in row.items">
          <div v-if="toggleLoadMenu == true" class="pre-menu">
            <div class="pre-menu-top loader-content" style="height: 20rem; width: 100%; margin-bottom: 1rem"></div>
            <div class="pre-menu-bot flex flex-between">
              <div class="pre-menu-bot-1 loader-content" style="height: 2rem; width: 6rem"></div>
              <div class="pre-menu-bot-2 loader-content" style="height: 2rem; width: 6rem"></div>
            </div>
          </div>
          <h1 v-if="toggleLoadMenu == false && toggleMenuEmpty == true" class="menu-empty">menu dengan kategori tersebut kosong</h1>
          <Menus
            v-if="toggleLoadMenu == false && toggleMenuEmpty == false"
            @click="(togglePopupDetail = true), ((popupDetailData.id = item.id), (popupDetailData.nama = item.nama), (popupDetailData.cover = item.cover), (popupDetailData.harga = item.harga))"
            :name="item.nama"
            :price="item.harga"
            :img="item.cover"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="popup-detail" :class="togglePopupDetail ? 'trans-0' : 'trans-y-100'">
    <div class="popup-detail-wrapper">
      <div class="popup-detail-wrapper-info">
        <img :src="urlApi + popupDetailData.cover" alt="" />
        <p>{{ popupDetailData.nama }}</p>
      </div>
      <div class="popup-detail-wrapper-btn">
        <div class="menu-value">
          <span @click="popupDetailData.jumlah--"><Icons name="minus" /></span>
          <input v-model="popupDetailData.jumlah" type="number" max="10" name="" id="" />
          <span @click="popupDetailData.jumlah++"> <Icons name="add" /> </span>
        </div>
        <div class="popup-detail-wrapper-btn-1" @click="addToCart()">Add To Cart</div>

        <div class="popup-detail-wrapper-btn-2" @click="goDetail(popupDetailData.id, popupDetailData.nama)">Detail</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.home {
  &-wrapper {
  }
  &-hero {
    margin: 0 2rem 2rem 2rem;
    border-radius: 2rem;
    overflow: hidden;
  }
  &-cat {
    padding: 0 2rem 2rem 2rem;
    &-wrapper {
      display: flex;
      gap: 2rem;
      &-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 60px 44px -49px black;
        border-radius: 1rem;
        padding: 0.5rem 2rem;
        border: solid 2px var(--color-grey-2);
        background-color: white;
        cursor: pointer;

        &.clear {
          color: var(--color-orange);
        }
        &.active {
          background-color: var(--color-orange);
          p {
            color: white;
          }
        }
        &-img {
          display: flex;
          align-items: center;
          img {
            height: 2rem;
            width: 2rem;
          }
        }
        p {
          text-transform: capitalize;
          font-size: 1.6rem;
          font-weight: 600;
          color: var(--color-black);
        }
      }
    }
  }
  &-menu {
    padding: 0 3rem 3rem 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}
.title-link {
  margin: 2rem 3rem;
  &-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-text {
      text-transform: capitalize;
      font-size: 2rem;
      font-weight: 600;
    }
    &-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      text-transform: capitalize;
      font-size: 1.6rem;
      font-weight: 600;
      color: rgba(black, 0.5);
      & svg {
        fill: rgba(black, 0.5);
        height: 2rem;
      }
    }
  }
}
.popup-detail {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.83, 0, 0.17, 1);
  &-wrapper {
    padding: 3rem;
    margin: 3rem;
    border-radius: 3rem;
    background-color: var(--color-black);
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      & img {
        height: 4rem;
      }
      & p {
        text-transform: capitalize;
        font-size: 2rem;
        font-weight: 500;
        color: white;
      }
    }
    &-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      &-1 {
        padding: 0.5rem 3rem;
        border-radius: 3rem;
        font-size: 2rem;
        font-weight: 500;
        color: var(--color-black);
        background-color: var(--color-green);
      }
      &-2 {
        padding: 0.5rem 3rem;
        border-radius: 3rem;
        font-size: 2rem;
        font-weight: 500;
        background-color: var(--color-grey-2);
        color: var(--color-black);
      }
    }
  }
}
</style>
