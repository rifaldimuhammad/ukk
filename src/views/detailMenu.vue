<script setup>
import { ref, reactive, onMounted } from 'vue';
import Icons from '../components/Icons.vue';
import { useRoute, useRouter } from 'vue-router';
import { apiClient, urlApi } from '../api/axios-config';
import Header from '../components/Header.vue';
let route = useRoute();
let valMenu = ref(4);
let toggleLoadContent = ref(false);
const rowDetail = reactive({
  items: [],
});
const getDetailMenu = async () => {
  toggleLoadContent.value = true;
  const { data } = await apiClient.get(`/menu/${route.params.id}`);
  rowDetail.items = data.data;
  toggleLoadContent.value = false;
};
onMounted(() => {
  getDetailMenu();
});

</script>
<template>
  <Header></Header>
  <div class="detail-menu">
    <div class="detail-menu-wrapper">
      <div class="detail-menu-wrapper-img">
        <div v-if="toggleLoadContent == true" class="loader-content" style="height: 25rem; width: 25rem"></div>
        <img v-else :src="urlApi + rowDetail.items.cover" class="detail-menu-wrapper-img-src" />
      </div>
      <div class="detail-menu-wrapper-info">
        <div class="detail-menu-wrapper-info-1">
          <div class="detail-menu-wrapper-info-1-title">
            <div v-if="toggleLoadContent == true" class="loader-content" style="height: 3rem; width: 10rem"></div>
            <p v-else>{{ rowDetail.items.nama }}</p>
            <p>cheezy mozarella</p>
          </div>
        </div>
        <div class="detail-menu-wrapper-info-2">
          <div class="detail-menu-wrapper-info-2-item">
            <img src="/src/assets/img/vegan.png" alt="burger.png" />
            <p>Vegan</p>
          </div>
          <div class="detail-menu-wrapper-info-2-item">
            <img src="/src/assets/img/burger.png" alt="burger.png" />
            <p>Medium</p>
          </div>
        </div>
        <div class="detail-menu-wrapper-info-3">
          <div v-if="toggleLoadContent == true" class="loader-content" style="height: 3rem; width: 100%"></div>
          <p v-else>{{ rowDetail.items.deskripsi }}</p>
        </div>
      </div>
      <div class="detail-menu-wrapper-action">
        <div class="detail-menu-wrapper-action-text">
          <div class="menu-value">
            <span @click="valMenu--"><Icons name="minus" /></span>
            <input v-model="valMenu" type="number" max="10" name="" id="" />
            <span @click="valMenu++"> <Icons name="add" /> </span>
          </div>
        </div>
        <div class="detail-menu-wrapper-action-btn">checkout rp {{ rowDetail.items.harga }}</div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.detail-menu {
  &-wrapper {
    width: -webkit-fill-available;
    height: -webkit-fill-available;
    &-img {
      background: var(--color-grey-2);
      height: 30rem;
      padding: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      &-src {
        height: 100%;
      }
    }
    &-info {
      padding: 3rem;
      background-color: white;
      &-1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        &-title {
          p {
            &:nth-child(1) {
              font-size: 2.4rem;
              font-weight: 500;
              text-transform: capitalize;
              color: var(--color-black);
            }
            &:nth-child(2) {
              font-size: 1.6rem;
              font-weight: 500;
              text-transform: capitalize;
              color: rgba(black, 0.5);
            }
          }
        }
      }
      &-2 {
        padding: 3rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;

        &-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 2rem;
          background-color: var(--color-grey-2);
          border-radius: 1rem;
          & img {
            height: 2rem;
          }
          & p {
            font-size: 1.6rem;
            font-weight: 500;
            color: var(--color-black);
          }
        }
        & span {
          height: 4rem;
          width: 1.5px;
          background: rgba(grey, 0.5);
        }
      }
      &-3 {
        p {
          font-size: 1.6rem;
          font-weight: 500;
          color: rgba(black, 0.5);
        }
      }
    }
    &-action {
      position: sticky;
      bottom: 0;
      background: white;
      box-shadow: 4px 4px 2rem rgba(grey, 0.2);
      padding: 1rem 3rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 5rem;
      &-text {
        color: var(--color-orange);
        font-size: 2.4rem;
        font-weight: 600;
        text-transform: capitalize;
      }
      &-btn {
        font-size: 2.4rem;
        font-weight: 500;
        text-transform: capitalize;
        padding: 0.5rem 4rem;
        border-radius: 1rem;
        background: var(--color-green);
        color: var(--color-black);
      }
    }
  }
}
</style>
