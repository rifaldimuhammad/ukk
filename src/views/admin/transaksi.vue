<script setup>
import { reactive, ref, onMounted } from 'vue';
import { apiClient, urlApi } from '../../api/axios-config';

let showAll = ref(true);
let showBelumBayar = ref(false);
let ShowSelesai = ref(false);
const row = reactive({
  items: [],
});
const getMenu = async () => {
  const { data } = await apiClient.get('/menu');
  row.items = data.data;
};
onMounted(() => {
  getMenu();
});
let showAllFunc = () => {
  showAll.value = true;
  showBelumBayar.value = false;
  ShowSelesai.value = false;
  getMenu();
};
let showBelumBayarFunc = () => {
  showAll.value = false;
  showBelumBayar.value = true;
  ShowSelesai.value = false;
};
let showSelesaiFunc = () => {
  showAll.value = false;
  showBelumBayar.value = false;
  ShowSelesai.value = true;
};
</script>
<template>
  <div class="transaksi">
    <div class="transaksi-head">
      <div @click="showAllFunc" :class="{ active: showAll }" class="transaksi-head-item">semua</div>
      <div @click="showBelumBayarFunc" :class="{ active: showBelumBayar }" class="transaksi-head-item">belum bayar</div>
      <div @click="showSelesaiFunc" :class="{ active: ShowSelesai }" class="transaksi-head-item">selesai</div>
    </div>
    <div v-if="showAll" class="table">
      <div class="table-wrapper">
        <div class="table-head">
          <div class="table-head-item">No</div>
          <div class="table-head-item">Nama</div>
          <div class="table-head-item">cover</div>
          <div class="table-head-item">kategori</div>
          <div class="table-head-item">deskripsi</div>
        </div>
        <div class="table-content">
          <div v-for="(item, index) in row.items" :key="index" class="table-content-item">
            <div class="table-content-item-col">{{ item.id }}</div>
            <div class="table-content-item-col">{{ item.nama }}</div>
            <div class="table-content-item-col">{{ item.cover }}</div>
            <div class="table-content-item-col">{{ item.kategori }}</div>
            <div class="table-content-item-col">{{ item.deskripsi }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showBelumBayar" class="table">hello from belum bayar</div>
    <div v-if="ShowSelesai" class="table">hello from selesai</div>
  </div>
</template>
<style lang="scss">
.transaksi {
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0 2rem rgba(grey, 0.3);
  &-head {
    display: flex;
    padding: 1rem 0;
    &-item {
      width: 100%;
      font-size: 1.6rem;
      font-weight: 600;
      text-align: center;
      cursor: pointer;

      &.active {
        background-color: lightblue;
      }
    }
  }
  & .table {
    width: -webkit-fill-available;
    &-wrapper {
      width: 100%;
    }
    &-head {
      border-bottom: solid 1px;
      background-color: lightgrey;
      width: -webkit-fill-available;
      display: flex;
      &-item {
        width: 100%;

        padding: 0.7rem 1rem;
        font-size: 1.6rem;
        text-align: center;
      }
    }
    &-content {
      width: -webkit-fill-available;
      &-item {
        width: 100%;
        display: flex;
        &-col {
          width: 100%;
          padding: 0.7rem 1rem;
          font-size: 1.6rem;
          text-align: center;
        }
      }
    }
  }
}
</style>
