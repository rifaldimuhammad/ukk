<script setup>
import { ref, reactive, onMounted } from 'vue';
import Icons from '../components/Icons.vue';
import { useRouter } from 'vue-router';
import { urlApi, apiClient } from '../api/axios-config';
import swal from 'sweetalert';
let toggleInvoice = ref(false);
let router = useRouter();
const rowMenu = reactive({
  items: [],
});
const rowCart = reactive({
  items: [],
});
let arrTotal = reactive({
  total: 0,
});
let rowGetInvoice = reactive({
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

const getCart = async () => {
  const { data } = await apiClient.get(`/pesanan`);
  rowCart.items = data.data;
  rowInvoice.pesanan = data.data;
  rowInvoice.pesanan.map(async (e) => {
    rowInvoice.fullJumlah += parseInt(e.jumlah_menu);
    rowInvoice.fullTotal += parseInt(e.total_harga);
    rowInvoice.id_pesanan.push(e.id);
    rowInvoice.id_menu.push(e.id_menu);
  });
  rowCart.items.map(async (e) => {
    arrTotal.total += parseInt(e.total_harga);
  });
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
      rowInvoice.fullJumlah = 0;
      rowInvoice.fullTotal = 0;
      getCart();
    }
  });
};

const addToInvoice = async () => {
  const field = new FormData();
  field.append('id_menu', rowInvoice.id_menu);
  field.append('id_pesanan', rowInvoice.id_pesanan);
  field.append('jumlah_pesanan', rowInvoice.fullJumlah);
  field.append('total_harga', rowInvoice.fullTotal);
  const { data } = await apiClient.post(`/invoice`, field);
  toggleInvoice.value = false;
  swal({
    title: 'Berhasil',
    text: 'Pesanan Terkonfirmasi',
    icon: 'success',
    buttons: ['Simpan Pesanan', 'Hapus Pesanan'],
    dangerMode: true,
  }).then(async (willDelete) => {
    if (willDelete) {
      rowCart.items.map(async (e) => {
        const { data } = await apiClient.delete(`/invoice/${e.id}`);
      });
      swal(`pesanan berhasil di hapus`, {
        icon: 'success',
      });
      getCart();
    }
  });
  getInvoice();
};
const getInvoice = async () => {
  const { data } = await apiClient.get(`/invoice`);
  rowGetInvoice.items = data.data;
};
onMounted(() => {
  getCart();
});
</script>
<template>
  <div class="cart">
    <div class="cart-title">
      <div class="cart-title-text">Cart</div>
      <div class="cart-title-close" @click="router.push({ name: 'home' })"><Icons name="close" /></div>
    </div>
    <div class="cart-content">
      <div v-for="(item, index) in rowCart.items" class="cart-content-item">
        <div class="cart-content-item-img">
          <img :src="urlApi + item.cover_menu" :alt="item.cover_menu" class="cart-content-item-img-src" />
        </div>
        <div class="cart-content-item-info">
          <div class="cart-content-item-info-1">{{ item.nama_menu }}</div>
          <div class="cart-content-item-info-2">100g</div>
          <div class="cart-content-item-info-3">
            jumlah : {{ item.jumlah_menu }}
            <div class="cart-content-item-info-3-price">Rp {{ item.total_harga }}</div>
          </div>
        </div>
        <div class="cart-content-item-trash" @click="deleteCart(item.id)">
          <Icons name="trash" />
        </div>
      </div>
    </div>
    <div class="cart-info">
      <div class="cart-info-item total">
        <div class="cart-info-item-left">subtotal Produk</div>
        <div class="cart-info-item-right">Rp {{ arrTotal.total }}k</div>
      </div>
      <div class="cart-info-btn" @click="toggleInvoice = true">order</div>
    </div>
  </div>

  <div class="invoice" v-if="toggleInvoice">
    <div class="invoice-wrapper">
      <div class="invoice-header">
        <p>Invoice <span>#34boisfd89 </span></p>
        <p>Total Makanan</p>
      </div>
      <div class="invoice-content">
        <!-- <div class="invoice-content-date">
          <div class="invoice-content-date-1">
            <p>Issued On</p>
            <p>Jul 23,2023</p>
          </div>
          <div class="invoice-content-date-2">
            <p>Due on</p>
            <p>Jul 25,2023</p>
          </div>
        </div> -->
        <div class="invoice-content-table">
          <p></p>
          <div class="invoice-content-table-head">
            <div class="invoice-content-table-head-item grow">Nama</div>
            <div class="invoice-content-table-head-item">Harga</div>
            <div class="invoice-content-table-head-item">Jumlah</div>
            <div class="invoice-content-table-head-item">Total Harga</div>
          </div>

          <div v-for="(item, index) in rowInvoice.pesanan" :key="index" class="invoice-content-table-info">
            <div class="invoice-content-table-info-item grow">{{ item.nama_menu }}</div>
            <div class="invoice-content-table-info-item">Rp {{ item.harga_menu }}k</div>
            <div class="invoice-content-table-info-item">{{ item.jumlah_menu }}</div>
            <div class="invoice-content-table-info-item">Rp {{ item.total_harga }}k</div>
          </div>
        </div>
        <div class="invoice-content-total">
          <div class="invoice-content-total-item grow">Total Pesanan</div>
          <div class="invoice-content-total-item"></div>
          <div class="invoice-content-total-item">{{ rowInvoice.fullJumlah }}</div>
          <div class="invoice-content-total-item">Rp {{ rowInvoice.fullTotal }}k</div>
        </div>

        <div class="invoice-content-alert">
          <Icons name="alert" />
          <p>Invoice akan di cetak dalam bentuk pdf setelah anda mengkonfirmasi pesanan ini</p>
        </div>
        <div class="invoice-content-btn">
          <button @click="toggleInvoice = false">Kembali</button>
          <button @click="addToInvoice()">Pesan Sekarang</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.cart {
  background-color: var(--color-grey-1);
  &-title {
    padding: 3rem;
    background-color: var(--color-black);
    border-radius: 0 0 3rem 3rem;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1;
    &-text {
      font-size: 2rem;
      color: white;
      font-weight: 400;
    }
    &-close {
      display: flex;
      align-items: center;
      cursor: pointer;
      & svg {
        height: 2.4rem;
        fill: white;
      }
    }
  }
  &-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    padding: 3rem;
    &-item {
      padding: 2rem;
      border-radius: 3rem;
      background-color: white;
      box-shadow: 4px 4px 2rem rgba(grey, 0.2);
      display: flex;
      gap: 2rem;
      position: relative;
      overflow: hidden;
      &-img {
        &-src {
          height: 15rem;
        }
      }
      &-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: -webkit-fill-available;
        &-1 {
          color: var(--color-black);
          font-weight: 600;
          text-transform: capitalize;
          font-size: 2rem;
        }
        &-2 {
          color: rgba(black, 0.5);
          font-weight: 500;
          text-transform: capitalize;
          font-size: 2rem;
        }
        &-3 {
          display: flex;
          justify-content: space-between;
          align-items: center;
          &-price {
            font-size: 2rem;
            font-weight: 600;
            color: var(--color-black);
            --note-theme: red;
          }
        }
      }
      &-trash {
        cursor: pointer;
        position: absolute;
        top: 0;
        right: 0;
        height: 5rem;
        width: 5rem;
        border-radius: 0 0 0 2rem;
        background-color: red;
        display: flex;
        align-items: center;
        justify-content: center;
        & svg {
          fill: white;
          height: 2rem;
        }
      }
    }
  }
  &-info {
    padding: 3rem;
    width: 100%;
    background-color: white;
    border-radius: 1rem 1rem 0 0;
    // box-shadow: 4px 4px 2rem rgba(grey, 0.3);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    &-item {
      padding: 0.5rem 0;
      border-radius: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      position: relative;

      &-left {
        font-size: 1.6rem;
        font-weight: 600;
        color: rgba(black, 0.4);
        text-transform: capitalize;
      }
      &-right {
        font-size: 1.6rem;
        font-weight: 600;
        color: rgba(black, 0.4);
      }

      &.total {
        & .cart-info-item-left {
          color: var(--color-black);
          font-size: 1.8rem;
        }
        & .cart-info-item-right {
          color: var(--color-black);
          font-size: 1.8rem;
        }
      }
    }
    &-btn {
      background-color: var(--color-black);
      padding: 0.5rem;
      width: -webkit-fill-available;
      border-radius: 1rem;
      text-align: center;
      color: white;
      text-transform: uppercase;
      cursor: pointer;
    }
  }
}
.invoice {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(black, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;

  &-wrapper {
    background-color: white;
    margin: 5rem;
    padding: 2rem;
    border-radius: 0.5rem;
    min-width: 70rem;
  }
  &-header {
    margin-bottom: 3rem;
    p {
      &:nth-child(1) {
        font-weight: 600;
        font-size: 2rem;
        span {
          color: lightblue;
        }
      }
      &:nth-child(2) {
      }
    }
  }
  &-content {
    &-date {
      margin-bottom: 2rem;
      display: flex;
      gap: 5rem;
      &-1 {
        p {
          font-size: 1.6rem;
          font-weight: 600;
          &:nth-child(1) {
            color: rgba(black, 0.3);
          }
          &:nth-child(2) {
            color: var(--color-black);
          }
        }
      }
      &-2 {
        p {
          font-size: 1.6rem;
          font-weight: 600;
          &:nth-child(1) {
            color: rgba(black, 0.3);
          }
          &:nth-child(2) {
            color: var(--color-black);
          }
        }
      }
    }
    &-table {
      border-radius: 0.5rem;
      overflow: hidden;
      border: solid 1px var(--color-grey-2);
      &-head {
        display: flex;
        width: 100%;
        padding: 0.5rem 0;
        background-color: var(--color-grey-2);
        &-item {
          text-align: center;
          font-size: 1.6rem;
          flex: 1;
          &.grow {
            flex: 3;
            text-align: start;
            padding: 0 2rem;
          }
        }
      }
      &-info {
        display: flex;
        width: 100%;
        &-item {
          text-align: center;
          padding: 1rem 0;
          flex: 1;
          font-size: 1.6rem;
          &.grow {
            display: flex;
            align-items: center;
            flex: 3;
            text-align: start;
            padding: 0 2rem;
          }
        }
      }
    }
    &-total {
      display: flex;
      width: 100%;
      &-item {
        text-align: center;
        padding: 1rem 0;
        flex: 1;
        font-size: 1.6rem;
        font-weight: 600;
        &.grow {
          display: flex;
          align-items: center;
          flex: 3;
          text-align: start;
          padding: 0 2rem;
        }
      }
    }
    &-alert {
      margin-bottom: 2rem;
      padding: 0.5rem 1rem;
      display: flex;
      gap: 1rem;
      border-radius: 0.5rem;
      border: solid 1px #ffe6b3;
      background-color: #fff2d6;
      color: var(--color-grey);
      font-weight: 500;
      & svg {
        fill: #ffab00;
        height: 2rem;
      }
      p {
      }
    }
    &-btn {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      button {
        cursor: pointer;
        font-size: 1.6rem;
        font-weight: 500;
        padding: 0.8rem 2rem;
        border-radius: 0.5rem;
        outline: none;
        border: none;
        background-color: transparent;

        &:nth-child(1) {
          border: solid 1px var(--color-grey-2);
          background-color: var(--color-grey-1);
        }
        &:nth-child(2) {
          background-color: red;
          color: white;
        }
      }
    }
  }
}
</style>
